import { useState } from 'react';
import {
  ThemeProvider, Box, Flex, Text, Button,
  Input, Switch, Tabs, TabsList, TabsTrigger, TabsContent,
} from '@sparrowengg/twigs-react';

/* ── SVG Icons ── */
const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const PlusIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const DragIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="6" r="1.5"/><circle cx="15" cy="6" r="1.5"/>
    <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
    <circle cx="9" cy="18" r="1.5"/><circle cx="15" cy="18" r="1.5"/>
  </svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const HiddenIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const TextIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);
const ArrowUpIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
  </svg>
);
const ArrowDownIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
  </svg>
);
const PipeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 6H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3"/>
    <path d="M16 6h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
  </svg>
);
const TagIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const WingIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const RecodeIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
  </svg>
);

/* ── Toggle Switch Row ── */
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

/* ── Sidebar Question Item ── */
function QuestionItem({ number, label, icon, active, showTooltip }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Box css={{ position: 'relative' }}
      onMouseEnter={() => showTooltip && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {(showTooltip && hovered) && (
        <Box css={{
          position: 'absolute',
          top: '-30px',
          left: '36px',
          backgroundColor: '#1f2937',
          color: '#fff',
          fontSize: '11px',
          padding: '4px 8px',
          borderRadius: '4px',
          whiteSpace: 'nowrap',
          zIndex: 20,
          pointerEvents: 'none',
        }}>
          want to edit prev question ?
          <Box css={{
            position: 'absolute',
            top: '100%',
            left: '10px',
            borderLeft: '4px solid transparent',
            borderRight: '4px solid transparent',
            borderTop: '4px solid #1f2937',
          }} />
        </Box>
      )}
      <Flex
        alignItems="center"
        gap="$2"
        css={{
          paddingLeft: '$4',
          paddingRight: '$4',
          paddingTop: '$3',
          paddingBottom: '$3',
          cursor: 'pointer',
          backgroundColor: active ? '#eff6ff' : 'transparent',
          borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
          '&:hover': { backgroundColor: active ? '#eff6ff' : '#f9fafb' },
        }}
      >
        <Box css={{ color: '#d1d5db', cursor: 'grab', flexShrink: 0 }}>
          <DragIcon />
        </Box>
        <Flex
          alignItems="center"
          justifyContent="center"
          css={{
            width: '22px',
            height: '22px',
            borderRadius: '50%',
            backgroundColor: active ? '#3b82f6' : '#e5e7eb',
            flexShrink: 0,
          }}
        >
          <Text css={{
            fontSize: '10px',
            color: active ? '#fff' : '#6b7280',
            fontWeight: '$7',
            lineHeight: 1,
          }}>
            {number}
          </Text>
        </Flex>
        <Text css={{
          fontSize: '$xs',
          color: active ? '#1d4ed8' : '#374151',
          fontWeight: active ? '$5' : '$4',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {label}
        </Text>
        {icon && <Box css={{ color: '#9ca3af', flexShrink: 0 }}>{icon}</Box>}
      </Flex>
    </Box>
  );
}

/* ── Main App ── */
export default function SurveyBuilder() {
  const [activeNav, setActiveNav] = useState('build');
  const [activeView, setActiveView] = useState('edit');
  const [choices, setChoices] = useState(['car', 'bus', 'auto']);
  const [toggles, setToggles] = useState({
    randomize: false,
    stacked: false,
    multipleAnswers: false,
    allowOther: false,
    noneAbove: false,
    allAbove: false,
    setDefault: false,
  });

  const setToggle = (key) => (val) => setToggles(prev => ({ ...prev, [key]: val }));

  const navItems = ['Build', 'Integrate', 'Distribute', 'Results'];

  return (
    <ThemeProvider>
      <Flex flexDirection="column" css={{ height: '100vh', backgroundColor: '#f5f6f8', overflow: 'hidden' }}>

        {/* ── TOP NAV ── */}
        <Flex
          alignItems="center"
          css={{
            height: '48px',
            backgroundColor: '$white900',
            borderBottom: '1px solid $neutral200',
            paddingLeft: '$4',
            paddingRight: '$6',
            flexShrink: 0,
            zIndex: 50,
          }}
        >
          {/* Left: breadcrumb */}
          <Flex alignItems="center" gap="$2" css={{ minWidth: '180px' }}>
            <Box css={{
              width: '28px', height: '28px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '$md', color: '$neutral500', cursor: 'pointer',
              '&:hover': { backgroundColor: '$neutral100' },
            }}>
              <HomeIcon />
            </Box>
            <Box css={{ color: '$neutral300' }}><ChevronRight /></Box>
            <Text css={{ fontSize: '$sm', color: '$neutral700', fontWeight: '$5' }}>test</Text>
          </Flex>

          {/* Center: nav tabs */}
          <Flex alignItems="center" gap="$1" css={{ flex: 1, justifyContent: 'center' }}>
            {navItems.map((item) => {
              const key = item.toLowerCase();
              const isActive = activeNav === key;
              return (
                <Box
                  key={key}
                  onClick={() => setActiveNav(key)}
                  css={{
                    paddingLeft: '$5',
                    paddingRight: '$5',
                    paddingTop: '$3',
                    paddingBottom: '$3',
                    cursor: 'pointer',
                    fontSize: '$sm',
                    fontWeight: isActive ? '$6' : '$4',
                    color: isActive ? '$primary600' : '$neutral500',
                    borderBottom: isActive ? '2px solid $primary500' : '2px solid transparent',
                    marginBottom: '-1px',
                    '&:hover': { color: '$primary600' },
                  }}
                >
                  {item}
                </Box>
              );
            })}
          </Flex>

          {/* Right: actions */}
          <Flex alignItems="center" gap="$3" css={{ minWidth: '180px', justifyContent: 'flex-end' }}>
            <Button size="sm" variant="outline" color="default">Save</Button>
            <Button size="sm" color="primary" leftIcon={<EyeIcon />}>Preview</Button>
          </Flex>
        </Flex>

        {/* ── BODY ── */}
        <Flex css={{ flex: 1, overflow: 'hidden' }}>

          {/* ── LEFT SIDEBAR ── */}
          <Flex
            flexDirection="column"
            css={{
              width: '220px',
              flexShrink: 0,
              backgroundColor: '$white900',
              borderRight: '1px solid $neutral200',
              overflow: 'hidden',
            }}
          >
            {/* Sidebar header */}
            <Flex
              alignItems="center"
              justifyContent="space-between"
              css={{
                paddingLeft: '$5',
                paddingRight: '$4',
                paddingTop: '$4',
                paddingBottom: '$4',
                borderBottom: '1px solid $neutral100',
              }}
            >
              <Text css={{ fontSize: '11px', fontWeight: '$7', color: '$neutral400', letterSpacing: '0.06em' }}>
                QUESTIONS
              </Text>
              <Flex alignItems="center" gap="$2">
                <Button size="xxs" variant="ghost" color="default">Invite</Button>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  css={{
                    width: '26px', height: '26px',
                    borderRadius: '50%',
                    backgroundColor: '$neutral200',
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '$neutral300' },
                  }}
                >
                  <UserIcon />
                </Flex>
              </Flex>
            </Flex>

            {/* Questions list */}
            <Box css={{ flex: 1, overflowY: 'auto', paddingTop: '$2' }}>
              <QuestionItem number="1" label="what do u like" active />
              <QuestionItem number="2" label="want to edit prev question ?" showTooltip />
              <QuestionItem number="3" label="Hidden Question" icon={<HiddenIcon />} />
              <QuestionItem number="4" label="What is your name" icon={<TextIcon />} />
            </Box>

            {/* Add question button */}
            <Box css={{ borderTop: '1px solid $neutral100', padding: '$3' }}>
              <Flex>
                <Button
                  size="sm"
                  variant="ghost"
                  color="default"
                  leftIcon={<PlusIcon />}
                  css={{
                    flex: 1,
                    justifyContent: 'flex-start',
                    borderRadius: '$md 0 0 $md',
                    borderRight: '1px solid $neutral200',
                  }}
                >
                  Add a question
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  color="default"
                  css={{ borderRadius: '0 $md $md 0', paddingLeft: '$3', paddingRight: '$3' }}
                >
                  <ChevronDown />
                </Button>
              </Flex>
            </Box>
          </Flex>

          {/* ── MAIN CONTENT ── */}
          <Flex flexDirection="column" css={{ flex: 1, overflow: 'hidden' }}>

            {/* Edit / View toggle */}
            <Flex
              justifyContent="flex-end"
              alignItems="center"
              css={{
                paddingLeft: '$6',
                paddingRight: '$6',
                paddingTop: '$3',
                paddingBottom: '$3',
                backgroundColor: '$white900',
                borderBottom: '1px solid $neutral100',
                flexShrink: 0,
              }}
            >
              <Flex css={{ border: '1px solid $neutral200', borderRadius: '$md', overflow: 'hidden' }}>
                {['Edit', 'View'].map((v) => {
                  const isActive = activeView === v.toLowerCase();
                  return (
                    <Box
                      key={v}
                      onClick={() => setActiveView(v.toLowerCase())}
                      css={{
                        paddingLeft: '$5',
                        paddingRight: '$5',
                        paddingTop: '$2',
                        paddingBottom: '$2',
                        fontSize: '$xs',
                        fontWeight: '$5',
                        cursor: 'pointer',
                        backgroundColor: isActive ? '$neutral800' : '$white900',
                        color: isActive ? '$white900' : '$neutral500',
                        '&:hover': { backgroundColor: isActive ? '$neutral800' : '$neutral50' },
                      }}
                    >
                      {v}
                    </Box>
                  );
                })}
              </Flex>
            </Flex>

            {/* Question editor */}
            <Box css={{ flex: 1, overflowY: 'auto', padding: '$6' }}>
              <Box css={{
                backgroundColor: '$white900',
                borderRadius: '$xl',
                border: '1px solid $neutral200',
                boxShadow: '$sm',
                overflow: 'hidden',
              }}>

                {/* Question title */}
                <Flex
                  alignItems="flex-start"
                  css={{
                    paddingLeft: '$6',
                    paddingRight: '$5',
                    paddingTop: '$5',
                    paddingBottom: '$4',
                    borderBottom: '1px solid $neutral100',
                  }}
                >
                  <Text css={{ fontSize: '$md', fontWeight: '$6', color: '$neutral700', marginRight: '$3', paddingTop: '2px' }}>
                    1.
                  </Text>
                  <Box css={{ flex: 1 }}>
                    <Text css={{ fontSize: '$md', fontWeight: '$6', color: '$neutral800' }}>
                      what do u like
                    </Text>
                    <Text css={{ fontSize: '$xs', color: '$neutral300', marginTop: '$2' }}>
                      Add description to your question.
                    </Text>
                  </Box>
                  {/* Arrow controls + pipe */}
                  <Flex alignItems="center" gap="$1" css={{ marginLeft: '$4', paddingTop: '2px' }}>
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}>
                      <ArrowUpIcon />
                    </Box>
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}>
                      <ArrowDownIcon />
                    </Box>
                    <Box css={{ width: '1px', height: '14px', backgroundColor: '$neutral200', marginLeft: '$1', marginRight: '$1' }} />
                    <Box css={{ color: '$neutral400', cursor: 'pointer', padding: '$1', borderRadius: '$sm', '&:hover': { backgroundColor: '$neutral100', color: '$neutral600' } }}>
                      <PipeIcon />
                    </Box>
                  </Flex>
                </Flex>

                {/* Choices */}
                <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$5', paddingBottom: '$4' }}>
                  <Flex gap="$3" css={{ marginBottom: '$4' }}>
                    {choices.map((choice, idx) => (
                      <Input
                        key={idx}
                        size="sm"
                        value={choice}
                        onChange={(e) => {
                          const updated = [...choices];
                          updated[idx] = e.target.value;
                          setChoices(updated);
                        }}
                        css={{ flex: 1 }}
                      />
                    ))}
                  </Flex>

                  {/* Add choice + Wing / Pipe */}
                  <Flex alignItems="center" justifyContent="space-between">
                    <Flex
                      alignItems="center"
                      gap="$2"
                      css={{
                        cursor: 'pointer',
                        color: '$primary500',
                        '&:hover': { color: '$primary700' },
                      }}
                    >
                      <PlusIcon />
                      <Text css={{ fontSize: '$xs', color: 'inherit', fontWeight: '$5' }}>Add New Choice</Text>
                    </Flex>
                    <Flex alignItems="center" gap="$2">
                      <Button size="xs" variant="ghost" color="default" leftIcon={<WingIcon />}>
                        Wing Choice!
                      </Button>
                      <Button size="xs" variant="ghost" color="default" leftIcon={<PipeIcon />}>
                        Pipe Answer
                      </Button>
                    </Flex>
                  </Flex>
                </Box>

                {/* Options / Logic / Bulk Choices panel */}
                <Box css={{ borderTop: '1px solid $neutral100' }}>
                  <Tabs defaultValue="options">
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      css={{
                        paddingLeft: '$3',
                        paddingRight: '$4',
                        borderBottom: '1px solid $neutral100',
                      }}
                    >
                      <TabsList css={{ borderBottom: 'none', backgroundColor: 'transparent' }}>
                        <TabsTrigger value="options" css={{ fontSize: '$xs' }}>
                          <Flex alignItems="center" gap="$2">
                            Options
                            <Box css={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                          </Flex>
                        </TabsTrigger>
                        <TabsTrigger value="logic" css={{ fontSize: '$xs' }}>Logic</TabsTrigger>
                        <TabsTrigger value="bulk" css={{ fontSize: '$xs' }}>Bulk Choices</TabsTrigger>
                      </TabsList>

                      <Flex alignItems="center" gap="$2">
                        <Button size="xs" variant="ghost" color="default" leftIcon={<StarIcon />}>
                          + Add Score
                        </Button>
                        <Button size="xs" variant="outline" color="default">Required</Button>
                        <Button size="xs" color="primary">Add Next Question</Button>
                      </Flex>
                    </Flex>

                    {/* Options Tab */}
                    <TabsContent value="options">
                      <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$5', paddingBottom: '$2' }}>
                        {/* toggle grid */}
                        <Box css={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(3, 1fr)',
                          gap: '$6',
                        }}>
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

                        {/* Set Default Answer */}
                        <Box css={{ marginTop: '$5', paddingTop: '$4', borderTop: '1px solid $neutral100' }}>
                          <Flex flexDirection="column" gap="$2" css={{ display: 'inline-flex' }}>
                            <Text css={{ fontSize: '$xs', color: '$neutral500', fontWeight: '$5' }}>Set Default Answer</Text>
                            <ToggleRow value={toggles.setDefault} onChange={setToggle('setDefault')} />
                          </Flex>
                        </Box>

                        {/* Footer row */}
                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          css={{
                            marginTop: '$4',
                            paddingTop: '$4',
                            paddingBottom: '$4',
                            borderTop: '1px solid $neutral100',
                          }}
                        >
                          <Flex
                            alignItems="center"
                            gap="$2"
                            css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}
                          >
                            <TagIcon />
                            <Text css={{ fontSize: '$xs', color: 'inherit', fontWeight: '$5' }}>+ Add Tag</Text>
                          </Flex>
                          <Flex
                            alignItems="center"
                            gap="$2"
                            css={{ cursor: 'pointer', color: '$neutral400', '&:hover': { color: '$neutral600' } }}
                          >
                            <RecodeIcon />
                            <Text css={{ fontSize: '$xs', color: 'inherit' }}>Recode values</Text>
                          </Flex>
                        </Flex>
                      </Box>
                    </TabsContent>

                    <TabsContent value="logic">
                      <Box css={{ paddingLeft: '$6', paddingRight: '$6', paddingTop: '$10', paddingBottom: '$10', textAlign: 'center' }}>
                        <Text css={{ fontSize: '$sm', color: '$neutral400' }}>No logic rules added yet.</Text>
                      </Box>
                    </TabsContent>

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
    </ThemeProvider>
  );
}
