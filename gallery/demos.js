// One demo per component. Each is a function of a unique suffix so several
// copies can share a page without clashing ids.

export const THEMES = [
  { id: '', name: 'Default', note: 'The built-in look. No theme file.' },
  { id: 'homepage', name: 'Homepage', note: 'Mid 1990s document web, rebuilt with modern CSS.' },
  { id: 'clean', name: 'Clean', note: 'Quiet and modern: rounded, soft shadows, teal.' },
  { id: 'contrast', name: 'Contrast', note: 'High contrast, WCAG AAA text, no shadows.' },
  { id: 'bold', name: 'Bold', note: 'Thick outlines, flat colour, hard shadows.' },
  { id: 'soft', name: 'Soft', note: 'Gentle, rounded, warm neutrals and berry.' },
];

export const DEMOS = [
  {
    id: 'lk-tabs',
    title: 'Tabs',
    html: () => `
      <lk-tabs label="Course sections">
        <div data-lk-tab="Overview"><p>Each child marked with a tab title becomes a tab.</p></div>
        <div data-lk-tab="Details"><p>Arrow keys, Home and End move between tabs.</p></div>
        <div data-lk-tab="Summary"><p>The last panel.</p></div>
      </lk-tabs>`,
  },
  {
    id: 'lk-accordion',
    title: 'Accordion',
    html: () => `
      <lk-accordion label="Course topics">
        <div data-lk-item="What you will learn" open><p>One section is open at a time by default.</p></div>
        <div data-lk-item="How it is assessed"><p>Up and Down arrows move between headings.</p></div>
        <div data-lk-item="What you need"><p>Enter or Space opens a section.</p></div>
      </lk-accordion>`,
  },
  {
    id: 'lk-modal',
    title: 'Modal dialog',
    html: (u) => `
      <p class="row"><button type="button" class="lk-button" data-variant="primary" data-lk-open="modal-${u}">Open a modal</button></p>
      <lk-modal id="modal-${u}" heading="Course details">
        <p>Focus stays inside while this is open. Press Escape, use the close button or click outside to dismiss it.</p>
        <div class="lk-modal__actions"><button type="button" class="lk-button" data-variant="primary" data-lk-close="ok">Got it</button></div>
      </lk-modal>`,
  },
  {
    id: 'lk-popover',
    title: 'Tooltip and popover',
    html: (u) => `
      <p class="row">
        <button type="button" class="lk-button" id="tip-${u}">Hover or focus me</button>
        <lk-tooltip for="tip-${u}">Opens the course guide</lk-tooltip>
        <button type="button" class="lk-button" data-lk-popover="pop-${u}">More about this</button>
      </p>
      <lk-popover id="pop-${u}" label="About this topic"><p>Popovers can hold <a href="#">links</a> and controls.</p></lk-popover>`,
  },
  {
    id: 'buttons',
    title: 'Buttons and badges',
    html: () => `
      <p class="row">
        <button type="button" class="lk-button">Default</button>
        <button type="button" class="lk-button" data-variant="primary">Primary</button>
        <button type="button" class="lk-button" data-variant="danger">Delete</button>
        <button type="button" class="lk-button" data-variant="link">Link style</button>
        <button type="button" class="lk-button" data-size="small">Small</button>
        <button type="button" class="lk-button" disabled>Disabled</button>
      </p>
      <p class="row">
        <span class="lk-badge">Draft</span>
        <span class="lk-badge" data-tone="primary">New</span>
        <span class="lk-badge" data-tone="success">Complete</span>
        <span class="lk-badge" data-tone="warning">Due soon</span>
        <span class="lk-badge" data-tone="danger">Overdue</span>
        <span class="lk-badge" data-tone="info">Optional</span>
      </p>`,
  },
  {
    id: 'lk-field',
    title: 'Form controls',
    html: (u) => `
      <lk-field label="Email address" hint="We will only use this to reply to your message" error="Enter an email address, like name@example.com">
        <input type="email" required />
      </lk-field>
      <lk-field label="Course"><select><option>Introduction to teaching</option><option>Assessment for learning</option></select></lk-field>
      <lk-field label="Your comments"><textarea rows="2"></textarea></lk-field>
      <lk-field label="How confident do you feel?"><input type="range" min="0" max="10" value="6" /></lk-field>
      <lk-choices legend="Preferred format" hint="Choose one">
        <label><input type="radio" name="format-${u}" checked /> Online</label>
        <label><input type="radio" name="format-${u}" /> Blended</label>
      </lk-choices>
      <lk-choices legend="Topics" hint="Choose at least two" min="2">
        <label><input type="checkbox" checked /> Assessment</label>
        <label><input type="checkbox" /> Feedback</label>
        <label><input type="checkbox" /> Planning</label>
      </lk-choices>`,
  },
  {
    id: 'lk-progress',
    title: 'Progress and stepper',
    html: () => `
      <div class="gap">
        <lk-progress label="Course progress" value="60" show-value></lk-progress>
        <lk-progress label="Loading"></lk-progress>
        <lk-stepper current="1" label="Enrolment steps"><ol><li>Your details</li><li>Choose a course</li><li>Confirm</li></ol></lk-stepper>
      </div>`,
  },
  {
    id: 'lk-toasts',
    title: 'Toast notifications',
    html: () => `
      <p class="row">
        <button type="button" class="lk-button" data-gallery-toast="success">Confirmation</button>
        <button type="button" class="lk-button" data-gallery-toast="warning">Warning with undo</button>
        <button type="button" class="lk-button" data-gallery-toast="danger">Error</button>
      </p>`,
  },
  {
    id: 'lk-quiz',
    title: 'Quiz',
    html: () => `
      <lk-quiz label="Check your understanding" title="Formative assessment">
        <div data-lk-question="Which of these is formative assessment?">
          <div data-lk-option correct data-feedback="Yes: it informs the next lesson.">A quick quiz in class</div>
          <div data-lk-option>A final exam</div>
          <div data-lk-option>An end-of-year report</div>
          <p data-lk-explanation>Formative assessment happens during learning, to guide teaching.</p>
        </div>
      </lk-quiz>`,
  },
  {
    id: 'lk-journal',
    title: 'Reflection journal',
    html: () => `
      <lk-journal title="Week 1 reflection">
        <div data-lk-prompt="What went well this week?" data-hint="Think about one lesson."></div>
        <div data-lk-prompt="What would you change next time?"></div>
      </lk-journal>`,
  },
  {
    id: 'lk-spectrum',
    title: 'Comparison spectrum',
    html: () => `
      <lk-spectrum statement="How should feedback be given?" left="Written" right="Spoken" expert="70"
        explanation="Spoken feedback allows a conversation, but write down the key points."></lk-spectrum>`,
  },
  {
    id: 'lk-rating',
    title: 'Self-assessment',
    html: () => `
      <lk-rating label="How confident are you?" scale="5" low="Not at all" high="Completely" summary>
        <div data-lk-statement="Planning a lesson"></div>
        <div data-lk-statement="Giving feedback"></div>
      </lk-rating>`,
  },
  {
    id: 'lk-timeline',
    title: 'Timeline',
    html: () => `
      <lk-timeline label="History" collapsible>
        <div data-lk-date="1962" data-title="Founded"><p>The first classes began.</p></div>
        <div data-lk-date="1990" data-title="New campus"><p>A move to the current site.</p></div>
        <div data-lk-date="2024" data-title="Blended learning"><p>Online and face-to-face combined.</p></div>
      </lk-timeline>`,
  },
  {
    id: 'lk-grid-explorer',
    title: 'Grid explorer',
    html: () => `
      <lk-grid-explorer label="Learning theories" columns="2">
        <div data-lk-cell="Behaviourism"><p>Learning as a change in behaviour.</p></div>
        <div data-lk-cell="Cognitivism"><p>Learning as processing information.</p></div>
        <div data-lk-cell="Constructivism"><p>Learners build knowledge.</p></div>
        <div data-lk-cell="Social learning"><p>Learning with others.</p></div>
      </lk-grid-explorer>`,
  },
  {
    id: 'lk-process',
    title: 'Step-by-step process',
    html: () => `
      <lk-process label="Planning a lesson">
        <div data-lk-step="Set the outcome"><p>Decide what learners will be able to do.</p></div>
        <div data-lk-step="Plan the activities"><p>Choose activities that let learners practise.</p></div>
        <div data-lk-step="Check understanding"><p>Decide how you will know it worked.</p></div>
      </lk-process>`,
  },
  {
    id: 'lk-scenario',
    title: 'Scenario',
    html: () => `
      <lk-scenario label="A late submission" start="start">
        <div data-lk-node="start" data-title="An email arrives">
          <p>A learner who has never been late before asks for an extra week.</p>
          <ul data-lk-choices>
            <li data-lk-goto="strict">Refuse: the deadline was clear</li>
            <li data-lk-goto="ext">Agree and arrange a check-in</li>
          </ul>
        </div>
        <div data-lk-node="strict" data-end data-outcome="poor" data-title="The learner disengages"><p>They stop attending.</p></div>
        <div data-lk-node="ext" data-end data-outcome="good" data-title="The learner catches up"><p>They submit on the new date.</p></div>
      </lk-scenario>`,
  },
];
