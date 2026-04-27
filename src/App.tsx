import { useState } from 'react'
import './App.css'

type Step = 'intro' | 'activity1' | 'activity2' | 'activity3'

interface ThoughtCycleData {
  situation: string
  feelings: string
  unhelpfulThought: string
}

const EMPTY_THOUGHT_CYCLE: ThoughtCycleData = {
  situation: '',
  feelings: '',
  unhelpfulThought: '',
}

const THINKING_PATTERNS = [
  {
    name: 'Catastrophising',
    description: 'Feeling like something is far worse than it really is.',
    example: '"My partner\'s late — they must have been in an accident."',
  },
  {
    name: 'Black and white thinking',
    description: 'Seeing things as all-or-nothing with no middle ground.',
    example: '"I failed that exam — I\'m going to fail my whole degree."',
  },
  {
    name: 'Emotional reasoning',
    description: 'Treating emotions as if they are facts.',
    example: '"I feel anxious — something bad is going to happen."',
  },
  {
    name: 'Must and should statements',
    description: 'Living by rigid rules and judging yourself harshly for not meeting them.',
    example: '"I should be able to cope." / "I must be calm at all times."',
  },
  {
    name: 'Jumping to conclusions',
    description: 'Assuming you know what others think, or predicting a bad future.',
    example: '"I\'m starting a new job — no one\'s going to speak to me."',
  },
  {
    name: 'Over-generalising',
    description: 'One bad event means all future events will follow the same pattern.',
    example: 'After failing your driving test, you think you\'ll never be able to drive.',
  },
  {
    name: 'Dismissing the positives',
    description: 'Ignoring positive aspects of life and focusing only on the negative.',
    example: 'Your boss gives a good review, but you think they\'re just saying it because they have to.',
  },
  {
    name: 'Labelling',
    description: 'Labelling yourself in negative ways after a setback.',
    example: '"I didn\'t cope well today — I\'m pathetic."',
  },
  {
    name: 'Personalisation',
    description: 'Believing everything is about you and blaming yourself for no logical reason.',
    example: '"My colleague is in a bad mood — I must have done something to upset them."',
  },
]

interface ThoughtRecordData {
  situation: string
  feelings: string
  feelingsRating: number
  unhelpfulThought: string
  thoughtBeliefRating: number
  evidenceFor: string
  evidenceAgainst: string
  alternativeThought: string
  alternativeBeliefRating: number
  revisedFeelingsRating: number
}

const EMPTY_THOUGHT_RECORD: ThoughtRecordData = {
  situation: '',
  feelings: '',
  feelingsRating: 50,
  unhelpfulThought: '',
  thoughtBeliefRating: 50,
  evidenceFor: '',
  evidenceAgainst: '',
  alternativeThought: '',
  alternativeBeliefRating: 50,
  revisedFeelingsRating: 50,
}

const THOUGHT_RECORD_TEXT_FIELDS: (keyof ThoughtRecordData)[] = [
  'situation', 'feelings', 'unhelpfulThought', 'evidenceFor', 'evidenceAgainst', 'alternativeThought',
]

const CHALLENGING_TIPS = [
  {
    icon: '🔍',
    title: 'Look for evidence',
    body: "Ask yourself: \"What facts actually support this thought? What evidence goes against it?\" Treating the thought like a hypothesis — not a fact — gives you distance from it.",
  },
  {
    icon: '⚖️',
    title: 'Consider alternatives',
    body: "Think: \"What would I say to a friend in the same situation?\" A more balanced view doesn't mean being unrealistically positive — it means being fair and realistic.",
  },
  {
    icon: '📊',
    title: 'Rate your beliefs',
    body: "Scoring how strongly you believe the thought (0–100%) before and after helps you track whether challenging it has reduced its hold on you.",
  },
]

interface CycleData {
  situation: string
  feelings: string
  thoughts: string
  bodyFelt: string
  whatYouDid: string
}

const EMPTY_CYCLE: CycleData = {
  situation: '',
  feelings: '',
  thoughts: '',
  bodyFelt: '',
  whatYouDid: '',
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  )
}

function ArrowLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

// ─── Intro Step ──────────────────────────────────────────────────────────────

function IntroStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="step">
      <div className="step-header">
        <span className="pill">Anxiety Self-Help Guide</span>
        <h1>Understanding Your Anxiety</h1>
        <p className="lead">
          This interactive guide uses evidence-based CBT techniques to help you
          recognise, understand, and manage anxiety symptoms — at your own pace.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <span className="feature-icon">🧠</span>
          <h3>Understand</h3>
          <p>Learn how thoughts, feelings, physical sensations and behaviour connect and reinforce each other.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">✍️</span>
          <h3>Reflect</h3>
          <p>Work through guided activities to map your own personal anxiety patterns.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🌱</span>
          <h3>Manage</h3>
          <p>Discover practical techniques — breathing exercises, thought-challenging, and more.</p>
        </div>
      </div>

      <div className="step-actions">
        <button className="btn btn-primary" onClick={onNext}>
          Begin — Activity 1 <ArrowRight />
        </button>
      </div>
    </div>
  )
}

// ─── Cycle Diagram ───────────────────────────────────────────────────────────

interface CycleDiagramProps {
  data: CycleData
  onChange: (field: keyof CycleData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function CycleDiagram({ data, onChange }: CycleDiagramProps) {
  return (
    <div className="diagram-scroll">
     <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '32px' }}>
        <div 
          className="cycle-box situation" 
          style={{ position: 'relative', top: 'auto', left: 'auto' }}
        >
          <div className="box-header">
            <span className="box-dot dot-blue" />
            <label htmlFor="cb-situation" className="box-label">Describe the situation</label>
          </div>
          <p className="box-hint">e.g. "I was at a party with people I didn't know."</p>
          <textarea
            id="cb-situation"
            value={data.situation}
            onChange={onChange('situation')}
            placeholder="Where were you? Who were you with? What was happening?"
          />
        </div>
      </div>      
      <div className="cycle-wrap">
        {/* SVG arrow overlay */}
        <svg
          className="cycle-svg"
          viewBox="0 0 640 560"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8" refY="5"
              markerWidth="6" markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* 1. Thoughts → Feelings (new curve) */}
          <path
            d="M 105 215 C 105 110 115 50 215 50"
            stroke="#3b82f6" strokeWidth="2" fill="none"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* 2. Body → Feelings (new curve) */}
          <path
            d="M 535 215 C 535 110 525 50 425 50"
            stroke="#3b82f6" strokeWidth="2" fill="none"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* 3. Body → What you did (original curve) */}
          <path
            d="M 535 358 C 535 440 490 478 428 478"
            stroke="#3b82f6" strokeWidth="2" fill="none"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />

          {/* 4. What you did → Thoughts (original curve) */}
          <path
            d="M 212 478 C 150 478 105 440 105 358"
            stroke="#3b82f6" strokeWidth="2" fill="none"
            markerStart="url(#arrow)"
            markerEnd="url(#arrow)"
          />
        </svg>

        {/* ── Input boxes (unchanged) ── */}
        <div className="cycle-box feelings">
          <div className="box-header">
            <span className="box-dot dot-purple" />
            <label htmlFor="cb-feelings" className="box-label">Your feelings</label>
          </div>
          <p className="box-hint">e.g. "alone, embarrassed"</p>
          <textarea
            id="cb-feelings"
            value={data.feelings}
            onChange={onChange('feelings')}
            placeholder="How did you feel emotionally?"
          />
        </div>

        <div className="cycle-box thoughts">
          <div className="box-header">
            <span className="box-dot dot-green" />
            <label htmlFor="cb-thoughts" className="box-label">Your thoughts</label>
          </div>
          <p className="box-hint">e.g. "no one wants to talk to me"</p>
          <textarea
            id="cb-thoughts"
            value={data.thoughts}
            onChange={onChange('thoughts')}
            placeholder="What was going through your mind?"
          />
        </div>

        <div className="cycle-box body">
          <div className="box-header">
            <span className="box-dot dot-amber" />
            <label htmlFor="cb-body" className="box-label">How your body felt</label>
          </div>
          <p className="box-hint">e.g. "heart beating fast, sweaty"</p>
          <textarea
            id="cb-body"
            value={data.bodyFelt}
            onChange={onChange('bodyFelt')}
            placeholder="What physical sensations did you notice?"
          />
        </div>

        <div className="cycle-box action">
          <div className="box-header">
            <span className="box-dot dot-red" />
            <label htmlFor="cb-action" className="box-label">What you did</label>
          </div>
          <p className="box-hint">e.g. "I hid in the corner"</p>
          <textarea
            id="cb-action"
            value={data.whatYouDid}
            onChange={onChange('whatYouDid')}
            placeholder="How did you behave? What actions did you take?"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Activity 1 Step ─────────────────────────────────────────────────────────

function Activity1Step({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [data, setData] = useState<CycleData>(EMPTY_CYCLE)

  const update =
    (field: keyof CycleData) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setData(prev => ({ ...prev, [field]: e.target.value }))

  const filled = Object.values(data).filter(v => v.trim().length > 0).length
  const allFilled = filled === 5

  return (
    <div className="step">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft /> Back
      </button>

      <div className="step-header">
        <span className="pill">Activity 1 of 3</span>
        <h1>What Keeps Anxiety Going?</h1>
        <p className="lead">
          The things you think, feel, and do when you're anxious can actually{' '}
          <strong>keep anxiety going</strong>. Fill in each box below with
          details from a time you felt anxious, and see how all four elements
          connect and reinforce each other.
        </p>
      </div>

      <CycleDiagram data={data} onChange={update} />

      <div className="progress-dots" aria-label={`${filled} of 5 boxes filled`}>
        {Object.keys(EMPTY_CYCLE).map((k) => (
          <span
            key={k}
            className={`dot ${data[k as keyof CycleData].trim() ? 'dot-filled' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="dots-label">{filled}/5 completed</span>
      </div>

      {allFilled && (
        <div className="success-box">
          ✓ Great work — you've mapped your anxiety cycle. Notice how each element
          connects to and reinforces the others. This awareness is the first step
          to breaking the cycle.
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn-primary" disabled={!allFilled} onClick={onNext}>
          Continue to Activity 2 <ArrowRight />
        </button>
      </div>
    </div>
  )
}

// ─── Activity 2 ──────────────────────────────────────────────────────────────

interface ThoughtCycleDiagramProps {
  data: ThoughtCycleData
  onChange: (field: keyof ThoughtCycleData) => (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

function ThoughtCycleDiagram({ data, onChange }: ThoughtCycleDiagramProps) {
  return (
    <div className="diagram-scroll">
      
      {/* ── 1. Situation Box (Moved outside and centered) ── */}
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '32px' }}>
        <div 
          className="cycle-box tc-situation" 
          style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto' }}
        >
          <div className="box-header">
            <span className="box-dot dot-blue" />
            <label htmlFor="tc-situation" className="box-label">Situation</label>
          </div>
          <p className="box-hint">e.g. "My partner was 20 minutes late home."</p>
          <textarea
            id="tc-situation"
            value={data.situation}
            onChange={onChange('situation')}
            placeholder="Describe what was happening — where, who, when."
          />
        </div>
      </div>

      {/* ── 2. The 2-Part Cycle (Thoughts <-> Feelings) ── */}
      <div className="thought-cycle-wrap" style={{ height: '220px' }}>
        <svg
          className="cycle-svg"
          viewBox="0 0 640 220"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <marker id="arrow2" viewBox="0 0 10 10" refX="8" refY="5"
              markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b82f6" />
            </marker>
          </defs>

          {/* Thoughts → Feelings (Top Curve) */}
          <path 
            d="M 270 60 C 300 25 340 25 370 60"
            stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrow2)" 
          />

          {/* Feelings → Thoughts (Bottom Curve) */}
          <path 
            d="M 370 110 C 340 145 300 145 270 110"
            stroke="#3b82f6" strokeWidth="2" fill="none" markerEnd="url(#arrow2)" 
          />
        </svg>

        <div className="cycle-box tc-thought" style={{ top: '0', left: '50px' }}>
          <div className="box-header">
            <span className="box-dot dot-red" />
            <label htmlFor="tc-thought" className="box-label">My unhelpful thought</label>
          </div>
          <p className="box-hint">e.g. "My partner has been in an accident!"</p>
          <textarea
            id="tc-thought"
            value={data.unhelpfulThought}
            onChange={onChange('unhelpfulThought')}
            placeholder="What thought popped into your mind?"
          />
        </div>

        <div className="cycle-box tc-feelings" style={{ top: '0', right: '50px', left: 'auto' }}>
          <div className="box-header">
            <span className="box-dot dot-purple" />
            <label htmlFor="tc-feelings" className="box-label">My feelings</label>
          </div>
          <p className="box-hint">e.g. "Scared, anxious"</p>
          <textarea
            id="tc-feelings"
            value={data.feelings}
            onChange={onChange('feelings')}
            placeholder="How did you feel emotionally?"
          />
        </div>
      </div>
      
    </div>
  )
}

function Activity2Step({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [data, setData] = useState<ThoughtCycleData>(EMPTY_THOUGHT_CYCLE)

  const update =
    (field: keyof ThoughtCycleData) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setData(prev => ({ ...prev, [field]: e.target.value }))

  const filled = Object.values(data).filter(v => v.trim().length > 0).length
  const allFilled = filled === 3

  return (
    <div className="step">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft /> Back
      </button>

      <div className="step-header">
        <span className="pill">Activity 2 of 3</span>
        <h1>Patterns of Unhelpful Thinking</h1>
        <p className="lead">
          Knowing the common patterns that unhelpful thoughts follow can help you{' '}
          <strong>recognise and challenge them</strong> before they have a negative
          effect on what you do.
        </p>
      </div>

      <div className="patterns-grid">
        {THINKING_PATTERNS.map(p => (
          <div key={p.name} className="pattern-card">
            <h4>{p.name}</h4>
            <p>{p.description}</p>
            <blockquote>{p.example}</blockquote>
          </div>
        ))}
      </div>

      <div className="a2-activity-intro">
        <h2>Now your turn</h2>
        <p>
          Use the boxes below to write about a time when you had an unhelpful thought.
          The next time you find yourself feeling anxious, it will be easier to remind
          yourself what is happening — and challenge the thought.
        </p>
      </div>

      <ThoughtCycleDiagram data={data} onChange={update} />

      <div className="progress-dots" aria-label={`${filled} of 3 boxes filled`}>
        {Object.keys(EMPTY_THOUGHT_CYCLE).map((k) => (
          <span
            key={k}
            className={`dot ${data[k as keyof ThoughtCycleData].trim() ? 'dot-filled' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="dots-label">{filled}/3 completed</span>
      </div>

      {allFilled && (
        <div className="success-box">
          ✓ Well done — you've identified an unhelpful thought and mapped how it connects
          to your feelings. This is the key first step to challenging it.
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn-primary" disabled={!allFilled} onClick={onNext}>
          Continue to Activity 3 <ArrowRight />
        </button>
      </div>
    </div>
  )
}

// ─── Activity 3 ──────────────────────────────────────────────────────────────

function Activity3Step({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const [data, setData] = useState<ThoughtRecordData>(EMPTY_THOUGHT_RECORD)

  const updateText =
    (field: keyof ThoughtRecordData) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) =>
      setData(prev => ({ ...prev, [field]: e.target.value }))

  const updateRating =
    (field: keyof ThoughtRecordData) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setData(prev => ({ ...prev, [field]: Number(e.target.value) }))

  const filled = THOUGHT_RECORD_TEXT_FIELDS.filter(
    f => (data[f] as string).trim().length > 0,
  ).length
  const allFilled = filled === THOUGHT_RECORD_TEXT_FIELDS.length

  return (
    <div className="step">
      <button className="btn-back" onClick={onBack}>
        <ArrowLeft /> Back
      </button>

      <div className="step-header">
        <span className="pill">Activity 3 of 3</span>
        <h1>Challenging Your Thoughts</h1>
        <p className="lead">
          Unhelpful thoughts are not facts. This activity shows you how to{' '}
          <strong>examine the evidence</strong> and find a more balanced, realistic
          way of thinking.
        </p>
      </div>

      <div className="tips-grid">
        {CHALLENGING_TIPS.map(t => (
          <div key={t.title} className="tip-card">
            <span className="tip-card-icon">{t.icon}</span>
            <h4>{t.title}</h4>
            <p>{t.body}</p>
          </div>
        ))}
      </div>

      <div className="a2-activity-intro">
        <h2>Your thought record</h2>
        <p>
          Work through the steps below. Take your time — the aim is to build a habit
          of examining your thoughts rather than accepting them at face value.
        </p>
      </div>

      <div className="thought-record">

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">1</span>
            <label htmlFor="tr-situation" className="tr-label">What was the situation?</label>
          </div>
          <p className="tr-hint">Who were you with? Where were you? What was happening?</p>
          <textarea
            id="tr-situation"
            className="tr-textarea"
            value={data.situation}
            onChange={updateText('situation')}
            placeholder='e.g. "I was waiting for an important job interview."'
          />
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">2</span>
            <label htmlFor="tr-feelings" className="tr-label">How did you feel?</label>
          </div>
          <p className="tr-hint">Name the emotion(s), then rate how intense the feeling was.</p>
          <textarea
            id="tr-feelings"
            className="tr-textarea"
            value={data.feelings}
            onChange={updateText('feelings')}
            placeholder='e.g. "Anxious, dreading it, ashamed"'
          />
          <div className="tr-rating-row">
            <span className="tr-rating-label">Intensity:</span>
            <input
              type="range" min="0" max="100"
              className="tr-slider"
              value={data.feelingsRating}
              onChange={updateRating('feelingsRating')}
              aria-label="Feelings intensity"
            />
            <span className="tr-rating-value">{data.feelingsRating}%</span>
          </div>
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">3</span>
            <label htmlFor="tr-thought" className="tr-label">What was the unhelpful thought?</label>
          </div>
          <p className="tr-hint">What was going through your mind? Write it word for word if you can.</p>
          <textarea
            id="tr-thought"
            className="tr-textarea"
            value={data.unhelpfulThought}
            onChange={updateText('unhelpfulThought')}
            placeholder={"e.g. \"I'm going to freeze up and make a fool of myself.\""}
          />
          <div className="tr-rating-row">
            <span className="tr-rating-label">Belief in thought:</span>
            <input
              type="range" min="0" max="100"
              className="tr-slider"
              value={data.thoughtBeliefRating}
              onChange={updateRating('thoughtBeliefRating')}
              aria-label="Belief in unhelpful thought"
            />
            <span className="tr-rating-value">{data.thoughtBeliefRating}%</span>
          </div>
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">4</span>
            <label htmlFor="tr-evidence-for" className="tr-label">Evidence that supports this thought</label>
          </div>
          <p className="tr-hint">Stick to observable facts — not feelings or interpretations.</p>
          <textarea
            id="tr-evidence-for"
            className="tr-textarea"
            value={data.evidenceFor}
            onChange={updateText('evidenceFor')}
            placeholder='e.g. "I did stumble over my words in a presentation last month."'
          />
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">5</span>
            <label htmlFor="tr-evidence-against" className="tr-label">Evidence against this thought</label>
          </div>
          <p className="tr-hint">What facts challenge or contradict the thought?</p>
          <textarea
            id="tr-evidence-against"
            className="tr-textarea"
            value={data.evidenceAgainst}
            onChange={updateText('evidenceAgainst')}
            placeholder={"e.g. \"I've successfully completed interviews before. My preparation has been thorough.\""}
          />
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">6</span>
            <label htmlFor="tr-alternative" className="tr-label">Alternative balanced thought</label>
          </div>
          <p className="tr-hint">Using the evidence above, write a fairer, more realistic version of the thought.</p>
          <textarea
            id="tr-alternative"
            className="tr-textarea"
            value={data.alternativeThought}
            onChange={updateText('alternativeThought')}
            placeholder={"e.g. \"I've prepared well and have done interviews before. I may feel nervous but I can cope.\""}
          />
          <div className="tr-rating-row">
            <span className="tr-rating-label">Belief in alternative:</span>
            <input
              type="range" min="0" max="100"
              className="tr-slider"
              value={data.alternativeBeliefRating}
              onChange={updateRating('alternativeBeliefRating')}
              aria-label="Belief in alternative thought"
            />
            <span className="tr-rating-value">{data.alternativeBeliefRating}%</span>
          </div>
        </div>

        <div className="tr-card">
          <div className="tr-card-header">
            <span className="tr-step-badge">7</span>
            <span className="tr-label">Re-rate your feelings now</span>
          </div>
          <p className="tr-hint">
            After working through the evidence, how intense is the feeling compared to step 2?
          </p>
          <div className="tr-rating-row">
            <span className="tr-rating-label">Feelings now:</span>
            <input
              type="range" min="0" max="100"
              className="tr-slider"
              value={data.revisedFeelingsRating}
              onChange={updateRating('revisedFeelingsRating')}
              aria-label="Revised feelings intensity"
            />
            <span className="tr-rating-value">{data.revisedFeelingsRating}%</span>
          </div>
          {allFilled && (
            <p className={`tr-feeling-change ${
              data.revisedFeelingsRating < data.feelingsRating ? 'positive'
              : data.revisedFeelingsRating === data.feelingsRating ? 'neutral'
              : 'higher'
            }`}>
              {data.revisedFeelingsRating < data.feelingsRating
                ? `↓ ${data.feelingsRating - data.revisedFeelingsRating}% reduction in intensity`
                : data.revisedFeelingsRating === data.feelingsRating
                ? '→ No change yet — keep practising'
                : `↑ Intensity rose by ${data.revisedFeelingsRating - data.feelingsRating}% — consider speaking to a professional`}
            </p>
          )}
        </div>

      </div>

      <div className="progress-dots" aria-label={`${filled} of ${THOUGHT_RECORD_TEXT_FIELDS.length} fields completed`}>
        {THOUGHT_RECORD_TEXT_FIELDS.map(f => (
          <span
            key={f}
            className={`dot ${(data[f] as string).trim() ? 'dot-filled' : ''}`}
            aria-hidden="true"
          />
        ))}
        <span className="dots-label">{filled}/{THOUGHT_RECORD_TEXT_FIELDS.length} completed</span>
      </div>

      {allFilled && (
        <div className="success-box">
          ✓ Excellent work — you've completed a full thought record. With practice this
          process becomes faster and more automatic. Try it whenever you notice an
          unhelpful thought.
        </div>
      )}

      <div className="step-actions">
        <button className="btn btn-primary" onClick={onNext}>
          Home
        </button>

              
      </div>
    </div>
  )
}

// ─── App Shell ───────────────────────────────────────────────────────────────

const STEP_LABELS: Record<Step, string> = {
  intro: 'Introduction',
  activity1: 'Activity 1',
  activity2: 'Activity 2',
  activity3: 'Activity 3',
}

const STEPS: Step[] = ['intro', 'activity1', 'activity2', 'activity3']

export default function App() {
  const [step, setStep] = useState<Step>('intro')
  const stepIndex = STEPS.indexOf(step)

  return (
    <div className="app">
      <main className="app-main">
        {step === 'intro'     && <IntroStep onNext={() => setStep('activity1')} />}
        {step === 'activity1' && <Activity1Step onBack={() => setStep('intro')} onNext={() => setStep('activity2')} />}
        {step === 'activity2' && <Activity2Step onBack={() => setStep('activity1')} onNext={() => setStep('activity3')} />}
        {step === 'activity3' && <Activity3Step onBack={() => setStep('activity2')} onNext={() => setStep('intro')}/>}
      </main>
    </div>
  )
}
