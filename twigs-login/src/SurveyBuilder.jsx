import { useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import {
  ThemeProvider, Box, Flex, Text, Button,
  Input, Switch, Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogContent, DialogHeader,
  DialogBody, DialogFooter,
} from '@sparrowengg/twigs-react';

/* ─────────────────────────────────────────────
   VSCode-Dark syntax-highlight theme (injected)
───────────────────────────────────────────── */
const editorStyle = `
@keyframes dotBounce {
  0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
  40% { transform: scale(1); opacity: 1; }
}
.ai-dot { animation: dotBounce 1.2s ease-in-out infinite; }
.ai-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-dot:nth-child(3) { animation-delay: 0.4s; }
.code-editor-wrap .token.comment,
.code-editor-wrap .token.prolog,
.code-editor-wrap .token.doctype,
.code-editor-wrap .token.cdata { color: #6a9955; }
.code-editor-wrap .token.punctuation { color: #d4d4d4; }
.code-editor-wrap .token.property,
.code-editor-wrap .token.tag,
.code-editor-wrap .token.boolean,
.code-editor-wrap .token.number,
.code-editor-wrap .token.constant,
.code-editor-wrap .token.symbol { color: #b5cea8; }
.code-editor-wrap .token.selector,
.code-editor-wrap .token.attr-name,
.code-editor-wrap .token.string,
.code-editor-wrap .token.char,
.code-editor-wrap .token.builtin { color: #ce9178; }
.code-editor-wrap .token.operator,
.code-editor-wrap .token.entity,
.code-editor-wrap .token.url { color: #d4d4d4; }
.code-editor-wrap .token.atrule,
.code-editor-wrap .token.attr-value,
.code-editor-wrap .token.keyword { color: #569cd6; }
.code-editor-wrap .token.function,
.code-editor-wrap .token.class-name { color: #dcdcaa; }
.code-editor-wrap .token.regex,
.code-editor-wrap .token.important,
.code-editor-wrap .token.variable { color: #9cdcfe; }
.code-editor-wrap textarea { outline: none !important; }
.code-editor-wrap textarea::selection { background: #264f78 !important; }
`;

/* ─────────────────────────────────────────────
   Custom Code Editor (textarea + PRE overlay)
───────────────────────────────────────────── */
function CodeEditor({ value, onChange, minHeight = '360px' }) {
  const highlighted = Prism.highlight(value, Prism.languages.javascript, 'javascript');
  const shared = {
    fontFamily: "'Fira Code','Cascadia Code','Consolas',monospace",
    fontSize: '13px',
    lineHeight: '1.6',
    padding: '20px',
    margin: 0,
    border: 'none',
    outline: 'none',
    whiteSpace: 'pre',
    wordWrap: 'normal',
    overflowWrap: 'normal',
    tabSize: 2,
    minHeight,
    width: '100%',
    boxSizing: 'border-box',
  };
  return (
    <div style={{ position: 'relative', backgroundColor: '#1e1e1e', minHeight }} className="code-editor-wrap">
      <pre
        aria-hidden="true"
        style={{
          ...shared,
          position: 'absolute',
          top: 0, left: 0,
          pointerEvents: 'none',
          color: '#d4d4d4',
          backgroundColor: 'transparent',
          overflow: 'hidden',
        }}
        dangerouslySetInnerHTML={{ __html: highlighted + '\n' }}
      />
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Tab') {
            e.preventDefault();
            const el = e.target;
            const start = el.selectionStart;
            const end = el.selectionEnd;
            const newVal = value.substring(0, start) + '  ' + value.substring(end);
            onChange(newVal);
            requestAnimationFrame(() => {
              el.selectionStart = el.selectionEnd = start + 2;
            });
          }
        }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        style={{
          ...shared,
          position: 'relative',
          zIndex: 1,
          color: 'transparent',
          caretColor: '#aeafad',
          backgroundColor: 'transparent',
          resize: 'none',
          overflowY: 'auto',
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const DEFAULT_JS = `Qualtrics.SurveyEngine.addOnload(function()
{
\t/*Place your JavaScript here to run when the page loads*/
});

Qualtrics.SurveyEngine.addOnReady(function()
{
\t/*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
\t/*Place your JavaScript here to run when the page is unloaded*/
});`;

const REQUIRED_SHELLS = [
  'Qualtrics.SurveyEngine.addOnload',
  'Qualtrics.SurveyEngine.addOnReady',
  'Qualtrics.SurveyEngine.addOnUnload',
];

const shellsMissing = (code) =>
  REQUIRED_SHELLS.filter((s) => !code.includes(s));

/* ─────────────────────────────────────────────
   AI mock generator
───────────────────────────────────────────── */
const AI_TEMPLATES = {
  validate: (prompt) => `Qualtrics.SurveyEngine.addOnload(function()
{
\t// AI: ${prompt}
\tvar self = this;
\tself.questionclick = function(event, element) {
\t\tvar answer = self.getSelectedAnswerValue();
\t\tif (!answer) {
\t\t\tself.setEmbeddedData('validationError', 'Please select an option');
\t\t}
\t};
});

Qualtrics.SurveyEngine.addOnReady(function()
{
\t/*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
\t/*Place your JavaScript here to run when the page is unloaded*/
});`,

  hide: (prompt) => `Qualtrics.SurveyEngine.addOnload(function()
{
\t// AI: ${prompt}
\tthis.hideChoices([1, 2]);
});

Qualtrics.SurveyEngine.addOnReady(function()
{
\t// Show/hide based on previous answer
\tvar prevAnswer = Qualtrics.SurveyEngine.getEmbeddedData('Q1_answer');
\tif (prevAnswer === 'Yes') {
\t\tthis.showChoices([1, 2]);
\t}
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
\t/*Place your JavaScript here to run when the page is unloaded*/
});`,

  timer: (prompt) => `Qualtrics.SurveyEngine.addOnload(function()
{
\t// AI: ${prompt}
\tvar timeLimit = 30; // seconds
\tvar self = this;
\tvar elapsed = 0;

\tvar interval = setInterval(function() {
\t\telapsed++;
\t\tif (elapsed >= timeLimit) {
\t\t\tclearInterval(interval);
\t\t\tself.clickNextButton();
\t\t}
\t}, 1000);

\tQualtrics.SurveyEngine.addEmbeddedData('TimeOnPage', elapsed);
});

Qualtrics.SurveyEngine.addOnReady(function()
{
\t/*Place your JavaScript here to run when the page is fully displayed*/
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
\tQualtrics.SurveyEngine.setEmbeddedData('TimeOnPage_final', elapsed);
});`,

  default: (prompt) => `Qualtrics.SurveyEngine.addOnload(function()
{
\t// AI Generated: ${prompt}
\tvar self = this;

\t// Custom logic starts here
\tconsole.log('Question loaded:', self.questionId);
\tself.setEmbeddedData('CustomEvent', 'loaded');
});

Qualtrics.SurveyEngine.addOnReady(function()
{
\t// Question is fully displayed
\tvar container = this.getQuestionContainer();
\tconsole.log('Question ready:', container);
});

Qualtrics.SurveyEngine.addOnUnload(function()
{
\t// Save data on unload
\tQualtrics.SurveyEngine.setEmbeddedData('UnloadTime', new Date().toISOString());
});`,
};

function generateAIMockCode(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('validate') || p.includes('required') || p.includes('check')) return AI_TEMPLATES.validate(prompt);
  if (p.includes('hide') || p.includes('show') || p.includes('display')) return AI_TEMPLATES.hide(prompt);
  if (p.includes('timer') || p.includes('time') || p.includes('countdown')) return AI_TEMPLATES.timer(prompt);
  return AI_TEMPLATES.default(prompt);
}

/* ─────────────────────────────────────────────
   Survey preview HTML builder
───────────────────────────────────────────── */
function buildPreviewHTML(jsCode) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Survey Preview</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f6f8;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .card{background:#fff;border-radius:12px;box-shadow:0 4px 24px rgba(0,0,0,.08);padding:40px 48px;width:100%;max-width:600px}
    h1{font-size:20px;font-weight:700;color:#111;margin-bottom:8px}
    p{font-size:14px;color:#666;margin-bottom:28px}
    .choices{display:flex;flex-direction:column;gap:12px;margin-bottom:28px}
    label{display:flex;align-items:center;gap:12px;padding:12px 16px;border:1.5px solid #e5e7eb;border-radius:8px;cursor:pointer;font-size:14px;color:#374151;transition:all .15s}
    label:hover{border-color:#3b82f6;background:#eff6ff}
    input[type=radio]{accent-color:#3b82f6;width:16px;height:16px}
    .btn{background:#3b82f6;color:#fff;border:none;border-radius:8px;padding:12px 28px;font-size:14px;font-weight:600;cursor:pointer;transition:background .15s}
    .btn:hover{background:#2563eb}
    .banner{background:#fef3c7;border:1px solid #fcd34d;border-radius:8px;padding:12px 16px;margin-bottom:20px;font-size:13px;color:#92400e;display:flex;gap:8px;align-items:center}
    .progress{height:4px;background:#e5e7eb;border-radius:2px;margin-bottom:32px;overflow:hidden}
    .progress-inner{height:100%;width:33%;background:#3b82f6;border-radius:2px}
  </style>
</head>
<body>
  <div class="card">
    <div class="banner">⚠ This is a preview. Custom JavaScript is active.</div>
    <div class="progress"><div class="progress-inner"></div></div>
    <h1>1. what do u like</h1>
    <p>Select one of the options below.</p>
    <div class="choices">
      <label><input type="radio" name="q1" value="car"/> Car</label>
      <label><input type="radio" name="q1" value="bus"/> Bus</label>
      <label><input type="radio" name="q1" value="auto"/> Auto</label>
    </div>
    <button class="btn" onclick="nextQ()">Next →</button>
  </div>
  <script>
    function nextQ(){alert('End of preview survey. ✓');}
    // Injected custom JavaScript:
    try {
      var Qualtrics = {
        SurveyEngine: {
          addOnload: function(fn){ try{fn.call({questionId:'QID1',getSelectedAnswerValue:function(){return document.querySelector('input[name=q1]:checked')?.value||null},setEmbeddedData:function(){},getQuestionContainer:function(){return document.querySelector('.card')}})}catch(e){console.warn('JS error:',e)} },
          addOnReady: function(fn){ window.addEventListener('load', function(){ try{fn.call({questionId:'QID1',getQuestionContainer:function(){return document.querySelector('.card')},showChoices:function(){},hideChoices:function(){}})}catch(e){console.warn('JS error:',e)} }); },
          addOnUnload: function(fn){ window.addEventListener('beforeunload', function(){ try{fn.call({})}catch(e){} }); },
          setEmbeddedData: function(){},
          getEmbeddedData: function(){ return null; },
        }
      };
      ${jsCode}
    } catch(e) {
      console.error('Custom JS error:', e);
    }
  </script>
</body>
</html>`;
}

/* ─────────────────────────────────────────────
   SVG Icons
───────────────────────────────────────────── */
const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const ChevronRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ChevronDown = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>;
const PlusIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const DragIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/></svg>;
const EyeIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const HiddenIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const TextIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>;
const ArrowUpIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>;
const ArrowDownIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>;
const PipeIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/><path d="M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/><line x1="12" y1="3" x2="12" y2="21"/></svg>;
const TagIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;
const StarIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const WingIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const RecodeIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/></svg>;
const CodeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const DisplayLogicIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>;
const SkipLogicIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="5 12 19 12"/><polyline points="15 6 21 12 15 18"/><line x1="5" y1="6" x2="5" y2="18"/></svg>;
const LoopIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>;
const FullscreenIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>;
const MinimiseIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/></svg>;
const SparklesIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 3l.75 2.25L22 6l-2.25.75L19 9l-.75-2.25L16 6l2.25-.75z"/><path d="M5 17l.5 1.5L7 19l-1.5.5L5 21l-.5-1.5L3 19l1.5-.5z"/></svg>;
const SendIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const PlayIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const WarningIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
const CheckIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ─────────────────────────────────────────────
   Toggle Switch Row
───────────────────────────────────────────── */
function ToggleRow({ value, onChange }) {
  return (
    <Flex alignItems="center" gap="$3">
      <Switch size="sm" checked={value} onChange={onChange} />
      <Text css={{ fontSize: '$xs', color: '$neutral500', fontWeight: '$5' }}>
        {value ? 'ON' : 'OFF'}
      </Text>
    </Flex>
  );
}

/* ─────────────────────────────────────────────
   Sidebar Question Item
───────────────────────────────────────────── */
function QuestionItem({ number, label, icon, active, showTooltip }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Box css={{ position: 'relative' }}
      onMouseEnter={() => showTooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showTooltip && hovered && (
        <Box css={{ position: 'absolute', top: '-30px', left: '36px', backgroundColor: '#1f2937', color: '#fff', fontSize: '11px', padding: '4px 8px', borderRadius: '4px', whiteSpace: 'nowrap', zIndex: 20, pointerEvents: 'none' }}>
          want to edit prev question ?
          <Box css={{ position: 'absolute', top: '100%', left: '10px', borderLeft: '4px solid transparent', borderRight: '4px solid transparent', borderTop: '4px solid #1f2937' }} />
        </Box>
      )}
      <Flex alignItems="center" gap="$2" css={{ paddingLeft: '$4', paddingRight: '$4', paddingTop: '$3', paddingBottom: '$3', cursor: 'pointer', backgroundColor: active ? '#eff6ff' : 'transparent', borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent', '&:hover': { backgroundColor: active ? '#eff6ff' : '#f9fafb' } }}>
        <Box css={{ color: '#d1d5db', cursor: 'grab', flexShrink: 0 }}><DragIcon /></Box>
        <Flex alignItems="center" justifyContent="center" css={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: active ? '#3b82f6' : '#e5e7eb', flexShrink: 0 }}>
          <Text css={{ fontSize: '10px', color: active ? '#fff' : '#6b7280', fontWeight: '$7', lineHeight: 1 }}>{number}</Text>
        </Flex>
        <Text css={{ fontSize: '$xs', color: active ? '#1d4ed8' : '#374151', fontWeight: active ? '$5' : '$4', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</Text>
        {icon && <Box css={{ color: '#9ca3af', flexShrink: 0 }}>{icon}</Box>}
      </Flex>
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Logic Row
───────────────────────────────────────────── */
function LogicRow({ icon, title, description, onDefine, disabled, buttonLabel = 'Define' }) {
  return (
    <Flex
      alignItems="center"
      css={{
        paddingLeft: '$6', paddingRight: '$6',
        paddingTop: '$5', paddingBottom: '$5',
        borderBottom: '1px solid $neutral100',
      }}
    >
      <Flex
        alignItems="center"
        justifyContent="center"
        css={{
          width: '36px', height: '36px', borderRadius: '50%',
          backgroundColor: disabled ? '$neutral100' : '$primary50',
          color: disabled ? '$neutral300' : '$primary500',
          flexShrink: 0, marginRight: '$4',
        }}
      >
        {icon}
      </Flex>
      <Box css={{ flex: 1 }}>
        <Text css={{ fontSize: '$sm', fontWeight: '$6', color: disabled ? '$neutral400' : '$neutral800', marginBottom: '$1' }}>
          {title}
        </Text>
        <Text css={{ fontSize: '$xs', color: '$neutral400', lineHeight: '$sm' }}>
          {description}
        </Text>
      </Box>
      <Button
        size="xs"
        variant="ghost"
        color={disabled ? 'default' : 'primary'}
        disabled={disabled}
        onClick={onDefine}
        css={{ flexShrink: 0, fontWeight: '$6' }}
      >
        {buttonLabel}
      </Button>
    </Flex>
  );
}

/* ─────────────────────────────────────────────
   AI Writing Panel
───────────────────────────────────────────── */
function AIPanel({ onGenerate }) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setDone(false);
    setTimeout(() => {
      onGenerate(generateAIMockCode(prompt));
      setLoading(false);
      setDone(true);
      setTimeout(() => { setDone(false); setOpen(false); setPrompt(''); }, 1500);
    }, 1800);
  };

  return (
    <Box css={{ borderBottom: '1px solid #2d2d2d' }}>
      {/* Toggle bar */}
      <Flex
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpen((o) => !o)}
        css={{
          paddingLeft: '$5', paddingRight: '$5', paddingTop: '$3', paddingBottom: '$3',
          cursor: 'pointer',
          background: open ? 'linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)' : '#1a1a2e',
          '&:hover': { backgroundColor: '#16213e' },
        }}
      >
        <Flex alignItems="center" gap="$2">
          <Box css={{ color: '#a78bfa' }}><SparklesIcon /></Box>
          <Text css={{ fontSize: '$xs', fontWeight: '$6', color: '#a78bfa' }}>Write JavaScript with AI</Text>
          <Box css={{
            fontSize: '10px', fontWeight: '$6', color: '#7c3aed',
            backgroundColor: '#ede9fe', paddingLeft: '$2', paddingRight: '$2',
            paddingTop: '1px', paddingBottom: '1px', borderRadius: '4px',
          }}>BETA</Box>
        </Flex>
        <Box css={{ color: '#6b7280', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
          <ChevronDown />
        </Box>
      </Flex>

      {/* Expandable prompt area */}
      {open && (
        <Box css={{ backgroundColor: '#141414', paddingLeft: '$5', paddingRight: '$5', paddingTop: '$4', paddingBottom: '$4' }}>
          <Text css={{ fontSize: '$xxs', color: '#6b7280', marginBottom: '$3', fontWeight: '$5' }}>
            Describe what you want the JavaScript to do
          </Text>
          <Flex gap="$2" alignItems="flex-end">
            <Box css={{ flex: 1, position: 'relative' }}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); } }}
                placeholder="e.g. Validate that the user selects an option before proceeding..."
                rows={2}
                style={{
                  width: '100%', background: '#1e1e1e', border: '1px solid #3d3d3d',
                  borderRadius: '6px', color: '#d4d4d4', fontSize: '12px',
                  padding: '8px 12px', resize: 'none', outline: 'none',
                  fontFamily: 'inherit', lineHeight: 1.5,
                }}
              />
            </Box>
            <Button
              size="sm"
              color="primary"
              disabled={!prompt.trim() || loading}
              onClick={handleGenerate}
              leftIcon={done ? <CheckIcon /> : loading ? undefined : <SendIcon />}
              css={{ flexShrink: 0, minWidth: '90px' }}
            >
              {loading ? 'Generating…' : done ? 'Done!' : 'Generate'}
            </Button>
          </Flex>
          {loading && (
            <Flex alignItems="center" gap="$2" css={{ marginTop: '$3' }}>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 1, 2].map((i) => (
                  <div key={i} className="ai-dot" style={{
                    width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#a78bfa',
                  }} />
                ))}
              </div>
              <Text css={{ fontSize: '$xxs', color: '#6b7280' }}>AI is generating your JavaScript…</Text>
            </Flex>
          )}
        </Box>
      )}
    </Box>
  );
}

/* ─────────────────────────────────────────────
   Confirm Save Dialog
───────────────────────────────────────────── */
function ConfirmSaveDialog({ open, onOpenChange, onConfirmed }) {
  const [typed, setTyped] = useState('');
  const isValid = typed.toLowerCase() === 'confirm';

  const handleSave = () => {
    if (!isValid) return;
    onConfirmed();
    setTyped('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) setTyped(''); }} size="sm">
      <DialogContent>
        <DialogHeader>
          <Text css={{ fontSize: '$md', fontWeight: '$7', color: '$neutral900' }}>Confirm Save</Text>
        </DialogHeader>
        <DialogBody>
          <Box>
            <Flex alignItems="flex-start" gap="$3" css={{ padding: '$4', backgroundColor: '#fef3c7', borderRadius: '$lg', marginBottom: '$4' }}>
              <Box css={{ color: '#d97706', flexShrink: 0, marginTop: '2px' }}><WarningIcon /></Box>
              <Text css={{ fontSize: '$xs', color: '#92400e', lineHeight: '$md' }}>
                Custom JavaScript will be applied to this question and executed during your live survey. Incorrect code may affect survey behaviour.
              </Text>
            </Flex>
            <Text css={{ fontSize: '$sm', color: '$neutral700', marginBottom: '$3' }}>
              Type <Box as="span" css={{ fontWeight: '$7', color: '$negative500', fontFamily: 'monospace' }}>confirm</Box> below to proceed:
            </Text>
            <Input
              size="sm"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Type confirm..."
              onKeyDown={(e) => { if (e.key === 'Enter') handleSave(); }}
              css={{ borderColor: typed.length > 0 ? (isValid ? '$positive500' : '$negative300') : '$neutral200' }}
            />
            {typed.length > 0 && !isValid && (
              <Text css={{ fontSize: '$xxs', color: '$negative500', marginTop: '$2' }}>
                Please type the word "confirm" exactly
              </Text>
            )}
          </Box>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" color="default" size="sm" onClick={() => { onOpenChange(false); setTyped(''); }}>Cancel</Button>
          <Button
            size="sm"
            color="primary"
            disabled={!isValid}
            onClick={handleSave}
            leftIcon={<CheckIcon />}
          >
            Save JavaScript
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ─────────────────────────────────────────────
   JS Editor Dialog
───────────────────────────────────────────── */
function JavaScriptEditorDialog({ open, onOpenChange }) {
  const [code, setCode] = useState(DEFAULT_JS);
  const [fullscreen, setFullscreen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [savedCode, setSavedCode] = useState(null);
  const [showSavedBanner, setShowSavedBanner] = useState(false);
  const missing = shellsMissing(code);

  const handleClear = () => setCode(DEFAULT_JS);

  const handleTestSurvey = () => {
    const html = buildPreviewHTML(code);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleSaveConfirmed = () => {
    setSavedCode(code);
    setShowSavedBanner(true);
    onOpenChange(false);
    setTimeout(() => setShowSavedBanner(false), 3000);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} size={fullscreen ? 'full' : 'xl'}>
        <DialogContent>
          <DialogHeader>
            <Flex alignItems="center" justifyContent="space-between" css={{ width: '100%' }}>
              <Text css={{ fontSize: '$md', fontWeight: '$7', color: '$neutral900' }}>Edit Question JavaScript</Text>
              <Button
                size="xs"
                variant="ghost"
                color="default"
                leftIcon={fullscreen ? <MinimiseIcon /> : <FullscreenIcon />}
                onClick={() => setFullscreen((f) => !f)}
              >
                {fullscreen ? 'Exit Full Screen' : 'Full Screen'}
              </Button>
            </Flex>
          </DialogHeader>

          <DialogBody>
            <Box css={{ padding: '0' }}>
              {/* AI Panel */}
              <AIPanel onGenerate={setCode} />

              {/* Shell warning banner */}
              {missing.length > 0 && (
                <Flex alignItems="center" gap="$2" css={{ paddingLeft: '$5', paddingRight: '$5', paddingTop: '$3', paddingBottom: '$3', backgroundColor: '#fff3cd', borderBottom: '1px solid #fcd34d' }}>
                  <Box css={{ color: '#d97706' }}><WarningIcon /></Box>
                  <Text css={{ fontSize: '$xs', color: '#92400e' }}>
                    Required function shells removed: {missing.map(s => s.split('.').pop()).join(', ')}. These are needed for the survey to work.
                  </Text>
                  <Button size="xs" variant="ghost" color="default" onClick={handleClear} css={{ marginLeft: 'auto', flexShrink: 0 }}>
                    Restore
                  </Button>
                </Flex>
              )}

              {/* Code editor */}
              <Box css={{ overflowY: 'auto', maxHeight: fullscreen ? 'calc(100vh - 300px)' : '360px' }}>
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  minHeight={fullscreen ? 'calc(100vh - 300px)' : '360px'}
                />
              </Box>

              {/* JS API link */}
              <Flex alignItems="center" css={{ paddingLeft: '$5', paddingRight: '$5', paddingTop: '$3', paddingBottom: '$3', backgroundColor: '#1e1e1e', borderTop: '1px solid #2d2d2d' }}>
                <Box
                  as="a"
                  href="https://api.qualtrics.com/ZG9jOjg3NzY4Mg-qualtrics-java-script-question-api-class"
                  target="_blank"
                  rel="noreferrer"
                  css={{ fontSize: '$xs', color: '#60a5fa', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  JS Question API ↗
                </Box>
              </Flex>
            </Box>
          </DialogBody>

          <DialogFooter>
            <Flex alignItems="center" justifyContent="space-between" css={{ width: '100%' }}>
              {/* Left: Clear */}
              <Button
                size="sm"
                variant="outline"
                color="error"
                onClick={handleClear}
              >
                ✕ Clear
              </Button>

              {/* Right: Test + Cancel + Save */}
              <Flex alignItems="center" gap="$3">
                <Button
                  size="sm"
                  variant="outline"
                  color="default"
                  leftIcon={<PlayIcon />}
                  onClick={handleTestSurvey}
                >
                  Test Survey
                </Button>
                <Button size="sm" variant="ghost" color="default" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button
                  size="sm"
                  color="primary"
                  leftIcon={<CheckIcon />}
                  onClick={() => setConfirmOpen(true)}
                >
                  Save
                </Button>
              </Flex>
            </Flex>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirm Save Dialog */}
      <ConfirmSaveDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirmed={handleSaveConfirmed}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Main Survey Builder
───────────────────────────────────────────── */
export default function SurveyBuilder() {
  const [activeNav, setActiveNav] = useState('build');
  const [activeView, setActiveView] = useState('edit');
  const [choices, setChoices] = useState(['car', 'bus', 'auto']);
  const [jsDialogOpen, setJsDialogOpen] = useState(false);
  const [jsSaved, setJsSaved] = useState(false);
  const [toggles, setToggles] = useState({
    randomize: false, stacked: false, multipleAnswers: false,
    allowOther: false, noneAbove: false, allAbove: false, setDefault: false,
  });
  const setToggle = (key) => (val) => setToggles((prev) => ({ ...prev, [key]: val }));
  const navItems = ['Build', 'Integrate', 'Distribute', 'Results'];

  return (
    <ThemeProvider>
      <style>{editorStyle}</style>
      <Flex flexDirection="column" css={{ height: '100vh', backgroundColor: '#f5f6f8', overflow: 'hidden' }}>

        {/* ── TOP NAV ── */}
        <Flex alignItems="center" css={{ height: '48px', backgroundColor: '$white900', borderBottom: '1px solid $neutral200', paddingLeft: '$4', paddingRight: '$6', flexShrink: 0, zIndex: 50 }}>
          <Flex alignItems="center" gap="$2" css={{ minWidth: '180px' }}>
            <Box css={{ width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '$md', color: '$neutral500', cursor: 'pointer', '&:hover': { backgroundColor: '$neutral100' } }}><HomeIcon /></Box>
            <Box css={{ color: '$neutral300' }}><ChevronRight /></Box>
            <Text css={{ fontSize: '$sm', color: '$neutral700', fontWeight: '$5' }}>test</Text>
          </Flex>
          <Flex alignItems="center" gap="$1" css={{ flex: 1, justifyContent: 'center' }}>
            {navItems.map((item) => {
              const key = item.toLowerCase();
              const isActive = activeNav === key;
              return (
                <Box key={key} onClick={() => setActiveNav(key)} css={{ paddingLeft: '$5', paddingRight: '$5', paddingTop: '$3', paddingBottom: '$3', cursor: 'pointer', fontSize: '$sm', fontWeight: isActive ? '$6' : '$4', color: isActive ? '$primary600' : '$neutral500', borderBottom: isActive ? '2px solid $primary500' : '2px solid transparent', marginBottom: '-1px', '&:hover': { color: '$primary600' } }}>{item}</Box>
              );
            })}
          </Flex>
          <Flex alignItems="center" gap="$3" css={{ minWidth: '180px', justifyContent: 'flex-end' }}>
            <Button size="sm" variant="outline" color="default">Save</Button>
            <Button size="sm" color="primary" leftIcon={<EyeIcon />}>Preview</Button>
          </Flex>
        </Flex>

        {/* ── BODY ── */}
        <Flex css={{ flex: 1, overflow: 'hidden' }}>

          {/* ── LEFT SIDEBAR ── */}
          <Flex flexDirection="column" css={{ width: '220px', flexShrink: 0, backgroundColor: '$white900', borderRight: '1px solid $neutral200', overflow: 'hidden' }}>
            <Flex alignItems="center" justifyContent="space-between" css={{ paddingLeft: '$5', paddingRight: '$4', paddingTop: '$4', paddingBottom: '$4', borderBottom: '1px solid $neutral100' }}>
              <Text css={{ fontSize: '11px', fontWeight: '$7', color: '$neutral400', letterSpacing: '0.06em' }}>QUESTIONS</Text>
              <Flex alignItems="center" gap="$2">
                <Button size="xxs" variant="ghost" color="default">Invite</Button>
                <Flex alignItems="center" justifyContent="center" css={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: '$neutral200', cursor: 'pointer', '&:hover': { backgroundColor: '$neutral300' } }}><UserIcon /></Flex>
              </Flex>
            </Flex>
            <Box css={{ flex: 1, overflowY: 'auto', paddingTop: '$2' }}>
              <QuestionItem number="1" label="what do u like" active />
              <QuestionItem number="2" label="want to edit prev question ?" showTooltip />
              <QuestionItem number="3" label="Hidden Question" icon={<HiddenIcon />} />
              <QuestionItem number="4" label="What is your name" icon={<TextIcon />} />
            </Box>
            <Box css={{ borderTop: '1px solid $neutral100', padding: '$3' }}>
              <Flex>
                <Button size="sm" variant="ghost" color="default" leftIcon={<PlusIcon />} css={{ flex: 1, justifyContent: 'flex-start', borderRadius: '$md 0 0 $md', borderRight: '1px solid $neutral200' }}>Add a question</Button>
                <Button size="sm" variant="ghost" color="default" css={{ borderRadius: '0 $md $md 0', paddingLeft: '$3', paddingRight: '$3' }}><ChevronDown /></Button>
              </Flex>
            </Box>
          </Flex>

          {/* ── MAIN CONTENT ── */}
          <Flex flexDirection="column" css={{ flex: 1, overflow: 'hidden' }}>
            <Flex justifyContent="flex-end" alignItems="center" css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$3', paddingBottom: '$3', backgroundColor: '$white900', borderBottom: '1px solid $neutral100', flexShrink: 0 }}>
              <Flex css={{ border: '1px solid $neutral200', borderRadius: '$md', overflow: 'hidden' }}>
                {['Edit', 'View'].map((v) => {
                  const isActive = activeView === v.toLowerCase();
                  return (
                    <Box key={v} onClick={() => setActiveView(v.toLowerCase())} css={{ paddingLeft: '$5', paddingRight: '$5', paddingTop: '$2', paddingBottom: '$2', fontSize: '$xs', fontWeight: '$5', cursor: 'pointer', backgroundColor: isActive ? '$neutral800' : '$white900', color: isActive ? '$white900' : '$neutral500', '&:hover': { backgroundColor: isActive ? '$neutral800' : '$neutral50' } }}>{v}</Box>
                  );
                })}
              </Flex>
            </Flex>

            <Box css={{ flex: 1, overflowY: 'auto', padding: '$6' }}>
              <Box css={{ backgroundColor: '$white900', borderRadius: '$xl', border: '1px solid $neutral200', boxShadow: '$sm', overflow: 'hidden' }}>

                {/* Question title */}
                <Flex alignItems="flex-start" css={{ paddingLeft: '$6', paddingRight: '$5', paddingTop: '$5', paddingBottom: '$4', borderBottom: '1px solid $neutral100' }}>
                  <Text css={{ fontSize: '$md', fontWeight: '$6', color: '$neutral700', marginRight: '$3', paddingTop: '2px' }}>1.</Text>
                  <Box css={{ flex: 1 }}>
                    <Text css={{ fontSize: '$md', fontWeight: '$6', color: '$neutral800' }}>what do u like</Text>
                    <Text css={{ fontSize: '$xs', color: '$neutral300', marginTop: '$2' }}>Add description to your question.</Text>
                  </Box>
                  <Flex alignItems="center" gap="$1" css={{ marginLeft: '$4', paddingTop: '2px' }}>
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}><ArrowUpIcon /></Box>
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}><ArrowDownIcon /></Box>
                    <Box css={{ width: '1px', height: '14px', backgroundColor: '$neutral200', marginLeft: '$1', marginRight: '$1' }} />
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}><PipeIcon /></Box>
                  </Flex>
                </Flex>

                {/* Choices */}
                <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$5', paddingBottom: '$4' }}>
                  <Flex gap="$3" css={{ marginBottom: '$4' }}>
                    {choices.map((choice, idx) => (
                      <Input key={idx} size="sm" value={choice} onChange={(e) => { const u = [...choices]; u[idx] = e.target.value; setChoices(u); }} css={{ flex: 1 }} />
                    ))}
                  </Flex>
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex alignItems="center" gap="$2" css={{ cursor: 'pointer', color: '$primary500', '&:hover': { color: '$primary700' } }}>
                      <PlusIcon />
                      <Text css={{ fontSize: '$xs', color: 'inherit', fontWeight: '$5' }}>Add New Choice</Text>
                    </Flex>
                    <Flex alignItems="center" gap="$2">
                      <Button size="xs" variant="ghost" color="default" leftIcon={<WingIcon />}>Wing Choice!</Button>
                      <Button size="xs" variant="ghost" color="default" leftIcon={<PipeIcon />}>Pipe Answer</Button>
                    </Flex>
                  </Flex>
                </Box>

                {/* Tabs panel */}
                <Box css={{ borderTop: '1px solid $neutral100' }}>
                  <Tabs defaultValue="logic">
                    <Flex alignItems="center" justifyContent="space-between" css={{ paddingLeft: '$3', paddingRight: '$4', borderBottom: '1px solid $neutral100' }}>
                      <TabsList css={{ borderBottom: 'none', backgroundColor: 'transparent' }}>
                        <TabsTrigger value="options" css={{ fontSize: '$xs' }}>
                          <Flex alignItems="center" gap="$2">Options <Box css={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} /></Flex>
                        </TabsTrigger>
                        <TabsTrigger value="logic" css={{ fontSize: '$xs' }}>
                          <Flex alignItems="center" gap="$2">
                            Logic
                            {jsSaved && <Box css={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '$positive500' }} />}
                          </Flex>
                        </TabsTrigger>
                        <TabsTrigger value="bulk" css={{ fontSize: '$xs' }}>Bulk Choices</TabsTrigger>
                      </TabsList>
                      <Flex alignItems="center" gap="$2">
                        <Button size="xs" variant="ghost" color="default" leftIcon={<StarIcon />}>+ Add Score</Button>
                        <Button size="xs" variant="outline" color="default">Required</Button>
                        <Button size="xs" color="primary">Add Next Question</Button>
                      </Flex>
                    </Flex>

                    {/* ── Options Tab ── */}
                    <TabsContent value="options">
                      <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$5', paddingBottom: '$2' }}>
                        <Box css={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '$6' }}>
                          {[
                            { key: 'randomize', label: 'Randomize' },
                            { key: 'stacked', label: 'Stacked' },
                            { key: 'multipleAnswers', label: 'Multiple Answers' },
                            { key: 'allowOther', label: 'Allow Other Option' },
                            { key: 'noneAbove', label: 'None of the above' },
                            { key: 'allAbove', label: 'All of the above' },
                          ].map(({ key, label }) => (
                            <Flex key={key} flexDirection="column" gap="$2">
                              <Text css={{ fontSize: '$xs', color: '$neutral500', fontWeight: '$5' }}>{label}</Text>
                              <ToggleRow value={toggles[key]} onChange={setToggle(key)} />
                            </Flex>
                          ))}
                        </Box>
                        <Box css={{ marginTop: '$5', paddingTop: '$4', borderTop: '1px solid $neutral100' }}>
                          <Flex flexDirection="column" gap="$2" css={{ display: 'inline-flex' }}>
                            <Text css={{ fontSize: '$xs', color: '$neutral500', fontWeight: '$5' }}>Set Default Answer</Text>
                            <ToggleRow value={toggles.setDefault} onChange={setToggle('setDefault')} />
                          </Flex>
                        </Box>
                        <Flex alignItems="center" justifyContent="space-between" css={{ marginTop: '$4', paddingTop: '$4', paddingBottom: '$4', borderTop: '1px solid $neutral100' }}>
                          <Flex alignItems="center" gap="$2" css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}>
                            <TagIcon /><Text css={{ fontSize: '$xs', color: 'inherit', fontWeight: '$5' }}>+ Add Tag</Text>
                          </Flex>
                          <Flex alignItems="center" gap="$2" css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}>
                            <RecodeIcon /><Text css={{ fontSize: '$xs', color: 'inherit' }}>Recode values</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </TabsContent>

                    {/* ── Logic Tab ── */}
                    <TabsContent value="logic">
                      <Box>
                        <LogicRow
                          icon={<DisplayLogicIcon />}
                          title="Display Logic"
                          description="Show this question or message only if given conditions are met"
                          onDefine={() => {}}
                        />
                        <LogicRow
                          icon={<SkipLogicIcon />}
                          title="Skip Logic"
                          description="Skip to a question based on conditions"
                          onDefine={() => {}}
                        />
                        <LogicRow
                          icon={<LoopIcon />}
                          title="Loop and Merge"
                          description={
                            <span>
                              This feature can be enabled at the section level{' '}
                              <Box as="a" href="#" css={{ color: '$primary500', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Learn more</Box>
                            </span>
                          }
                          disabled
                        />
                        <LogicRow
                          icon={<CodeIcon />}
                          title="Custom JavaScript"
                          description={jsSaved ? "Custom JavaScript is active on this question" : "Add custom JavaScript to run at specific points in the survey lifecycle"}
                          buttonLabel={jsSaved ? "Edit JavaScript" : "Add JavaScript"}
                          onDefine={() => setJsDialogOpen(true)}
                        />

                        {/* Footer */}
                        <Flex alignItems="center" justifyContent="space-between" css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$4', paddingBottom: '$4', borderTop: '1px solid $neutral100' }}>
                          <Flex alignItems="center" gap="$2" css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}>
                            <TagIcon /><Text css={{ fontSize: '$xs', color: 'inherit', fontWeight: '$5' }}>+ Add Tag</Text>
                          </Flex>
                          <Flex alignItems="center" gap="$2" css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}>
                            <RecodeIcon /><Text css={{ fontSize: '$xs', color: 'inherit' }}>Recode values</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </TabsContent>

                    {/* ── Bulk Choices Tab ── */}
                    <TabsContent value="bulk">
                      <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$10', paddingBottom: '$10', textAlign: 'center' }}>
                        <Text css={{ fontSize: '$sm', color: '$neutral400' }}>Paste bulk choices here.</Text>
                      </Box>
                    </TabsContent>
                  </Tabs>
                </Box>
              </Box>
            </Box>
          </Flex>
        </Flex>
      </Flex>

      {/* JS Editor Dialog (outside main layout to avoid stacking context issues) */}
      <JavaScriptEditorDialog
        open={jsDialogOpen}
        onOpenChange={setJsDialogOpen}
      />
    </ThemeProvider>
  );
}
