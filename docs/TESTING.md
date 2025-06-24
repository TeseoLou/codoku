# TESTING.md

## 6. Testing

### Introduction

Testing is a critical component of the development lifecycle and plays an essential role in producing a stable, accessible, and user-friendly application. For a project like **Codoku** — an interactive, browser-based Sudoku game — testing ensures that the interface is not only visually consistent and responsive but also meets accessibility standards, functions correctly across modern devices and browsers, and delivers a smooth user experience.

Codoku was tested using a combination of **automated tools** and **manual techniques** across multiple categories:

- **Code validation** to check compliance with HTML and CSS standards
- **Accessibility evaluation** using tools and hands-on navigation testing
- **Performance and SEO auditing** using Lighthouse
- **Manual interaction testing** for gameplay features
- **Responsive design checks** across a variety of screen sizes
- **Cross-browser compatibility testing**

All issues discovered during testing were documented and resolved, and results are detailed in this document along with screenshots to verify successful validation.

## **6.1 Code Validation**
Validation ensures that the code behind Codoku adheres to current web standards and best practices, helping improve reliability, maintainability, and browser compatibility. 

All HTML, CSS, and JavaScript files were passed through official validation tools such as the [W3C Markup Validator](https://validator.w3.org/), [W3C CSS Validator](https://jigsaw.w3.org/css-validator/), and [JSHint](https://jshint.com/). 

This process helped identify and resolve syntax errors, semantic issues, accessibility oversights, and outdated or unsupported syntax ensuring the final product is stable, clean, and standards-compliant.

### **6.1.1 HTML Validation**

All HTML files (`index.html`, `about.html`, and `404.html`) were validated using the [W3C Markup Validation Service](https://validator.w3.org/). This process checks for syntax errors, deprecated tags, improperly nested elements, and other violations of the HTML5 specification.

#### **`index.html` - Results**
The `index.html` file serves as the main interactive hub of Codoku, housing the Sudoku grid, control buttons, difficulty and timer setup, and all associated modals. It also links to all the key JavaScript and CSS files that power the app’s functionality.

During HTML validation using the W3C Markup Validation Service, a number of informational notices, warnings, and a few errors were flagged. Each was reviewed and resolved during development.

⚠️ Highlighted validation issues:  
- **Trailing slashes on void elements**  
  Multiple lines such as `<meta charset="UTF-8"/>` and `<link rel="stylesheet".../>` triggered info messages like:  
  >> _"Trailing slash on void elements has no effect and interacts badly with unquoted attribute values."_

  These messages appear when self-closing syntax (`/>`) is applied to void elements in HTML5. Although this syntax is not invalid, it can cause unintended effects with certain attribute formatting. All unnecessary slashes were removed for full compliance and best practice.

- **Redundant ARIA roles**  
  HTML5 elements such as `<nav>`, `<footer>`, and `<button>` inherently include appropriate ARIA roles. Instances like `role="navigation"` or `role="button"` were removed to reduce clutter and improve semantic accuracy.

- **Missing or empty headings in sections**  
  Several `<section>` elements were missing descriptive headings or contained empty heading tags. These were addressed by:
  - Adding `<h2>` or `<h3>` tags where needed
  - Replacing `<section>` with `<div>` in purely structural contexts

- **Duplicate `aria-expanded` attribute**  
  A toggle element was found with two `aria-expanded` attributes. One was removed to maintain valid and functional ARIA behavior.

- **Broken ARIA references**  
  One element included `aria-labelledby="alert-modal-label"`, but the corresponding ID was missing from the DOM at the time of validation. This was corrected by ensuring the label element exists with the appropriate `id`.

After implementing all necessary corrections, the file was revalidated and passed without any remaining issues.

![HTML validation - index.html](figures/validation/index.webp)  
*Screenshot of W3C validator result showing “No errors or warnings” for index.html*

#### **`about.html` - Results**

The `about.html` page introduces the Codoku project, explains its development context, and provides insight into the design philosophy and purpose of the game. It features descriptive text, responsive layout, and multiple decorative images supported by accessible alt tags.

When tested using the W3C Markup Validation Service, the file initially displayed multiple issues. These were reviewed, corrected, or acknowledged as acceptable where appropriate.

⚠️ Highlighted validation issues:  
- **Trailing slashes on void elements**  
  Numerous tags like `<meta/>` and `<link/>` triggered info-level warnings such as: 
  >> _"Trailing slash on void elements has no effect and interacts badly with unquoted attribute values."_  

  These were corrected by removing the unnecessary slashes, ensuring cleaner and more standards-compliant HTML5 markup.

- **Redundant ARIA roles**  
  The `role` attributes on semantic elements like `<nav>` and `<button>` were removed, as HTML5 already implies these roles.

- **Missing headings in `<section>` elements**  
  Several sections lacked heading tags. According to accessibility and semantic best practices, headings should be present or `<div>` should be used instead. These issues were resolved by adding `<h2>` or `<h3>` where appropriate.

- **Duplicate and conflicting ARIA attributes**  
  A duplicate `aria-describedby` attribute was found and removed, ensuring better assistive technology compatibility.

- **Improper `height` value on `<img>` tags**  
  Images used `height="auto"`, which is invalid in HTML5 and flagged as:  
  >> _"Bad value auto for attribute height on element img: Expected a digit but saw a instead."_  
  
  This was corrected by removing the `height` attribute entirely and allowing Bootstrap’s responsive classes to control scaling.

- **Unclosed HTML elements**  
  An error near the end of the document indicated an unclosed `<main>` tag, leading to:  
  >> _"End tag for body seen, but there were unclosed elements."_  
  
  This was resolved by properly closing all open tags before the end of the document.

After addressing all these concerns, the `about.html` page now passes validation with no remaining errors.

![HTML validation - about.html](figures/validation/about.webp)
*W3C validator confirmation for about.html with an image report verifying proper alt text usage*

#### **`404.html` - Results**

The `404.html` page is a custom error page displayed when a user attempts to access a route that does not exist. It provides a lighthearted visual message and offers a route back to the homepage to retain user engagement. Like the other pages, it shares the same navigation, modal, and theme-switching logic for consistency across the site.

The file was run through the W3C Markup Validation Service and, like the other pages, returned a number of issues—primarily warnings and a few minor errors. All were addressed through careful revisions.

⚠️ Highlighted validation issues:  
- **Trailing slashes on void elements**  
  Many `<meta/>`, `<link/>`, and `<input/>` tags used trailing slashes that are unnecessary in HTML5. These caused repeated warnings:  
  >> _"Trailing slash on void elements has no effect and interacts badly with unquoted attribute values."_  
  
  All slashes were removed to ensure proper HTML5 compliance.

- **Unnecessary ARIA roles**  
  Elements such as `<nav>`, `<main>`, and `<button>` had redundant `role` attributes which were removed for semantic clarity and cleaner markup.

- **Duplicate attribute**  
  The `aria-expanded` attribute appeared more than once on an element. This was corrected by retaining only a single instance.

- **Section elements missing headings**  
  Several `<section>` tags lacked associated heading elements. To improve semantic structure and accessibility, appropriate heading tags were added or the structure changed to `<div>` where headings were not needed.

- **Invalid image `height="auto"`**  
  One image used the value `auto` in its height attribute, which is invalid:  
  >> _"Error: Bad value auto for attribute height on element img: Expected a digit but saw a instead."_  
  
  This was resolved by removing the `height` attribute altogether and allowing CSS to handle scaling through responsive utility classes like `.img-fluid`.

After resolving all of the above issues, the `404.html` file now passes validation with no outstanding errors or warnings.

![HTML validation - 404.html](figures/validation/404.webp)
*W3C validation result for 404.html indicating no issues and highlighting alt text on images*

![HTML5 Validator Badge](figures/validation/html5-validator-badge.webp)  
![HTML5 Validator Badge (Blue)](figures/validation/html5-validator-badge-blue.webp)

### **6.1.2 CSS Validation**

The primary stylesheet `style.css` was tested using the [W3C CSS Validation Service](https://jigsaw.w3.org/css-validator/). The validator analyzes the stylesheet for syntax errors, unsupported properties, and incorrect value usage across various levels of CSS.

#### **`style.css` Results**
The style.css file contains all the core styling rules for Codoku, including custom variables, responsive layout structures, theme toggling, dark mode overrides, and component-level styling for modals, the grid, and controls. It supports both light and dark themes and integrates cleanly with Bootstrap to enhance UI consistency and accessibility across screen sizes and devices.

Despite the complexity and breadth of the stylesheet, no errors were reported by the validator. This confirms that the CSS is well-structured, standards-compliant, and compatible with all major browsers.

![CSS validation result](figures/validation/stylesheet.webp)  
*CSS validator confirmation screen for style.css showing zero errors.*

![CSS Validator Badge (Gold)](figures/validation/css-validation.webp)  
![CSS Validator Badge (Blue)](figures/validation/css-validation-blue.webp)

⚠️ Warnings

Although the Codoku `style.css` file passed W3C validation without any errors, the validator did return 17 warnings, which are important to note for transparency and future maintenance.

These warnings were primarily related to:

1. CSS Custom Properties (Variables) 
   > *“Due to their dynamic nature, CSS variables are currently not statically checked.”*  
   - This is a known limitation of the W3C CSS Validator: it cannot evaluate computed styles that rely on custom properties such as `--color-primary` or `--cell-size`. These are used extensively in Codoku to support themes, responsiveness, and modularity.  
   - **Resolution**: No action is required. This is not a fault in the CSS, but a limitation of static analysis tools.

2. Same color for background and border  
   > *“Same color for background-color and border-color”* for selectors such as:  
     ```css
     #sound-switch:checked {
       background-color: #a5f3a5;
       border-color: #a5f3a5;
     }
     ```
   - These are **intentional design choices** meant to create flat, unified UI components. In this context, using the same color is acceptable and visually consistent.

### **6.1.3 JavaScript Validation**

All JavaScript files used in Codoku were validated using [JSHint](https://jshint.com/), a popular static code analysis tool designed to detect errors and potential problems in JavaScript code. The goal of this validation was to ensure that the scripts are syntactically correct, logically sound, and compatible with modern browser environments.

JSHint was configured to evaluate:
- **Cyclomatic complexity**
- **Unused and undefined variables**
- **ES6 syntax support**
- **Browser and jQuery environments**
- **Potential pitfalls**, such as unsafe line breaks or legacy code patterns

This helped identify both technical issues and stylistic problems early in development. Warnings and issues flagged were reviewed and addressed where appropriate, or acknowledged when contextually valid (e.g. use of globally defined functions or modular dependencies).

#### **`init.js` - Results**
The `init.js` file contains logic related to page initialization and UI setup. It includes functions to launch modals, configure toggles, and prepare the game interface on page load.

- **Functions defined**: 3  
- **Cyclomatic complexity**: 3 (well within acceptable range)  
- **Largest function**: 11 statements  
- **Unused variable**: `showAlertModal` (declared but not invoked inside this file)  
- **Undefined variables**:  
  - `bootstrap`  
  - `setupOutsideNavbarCollapse`  
  - `setupThemeSwitch`  
  - `setupStartButton`  
  - `setupSoundToggle`  
  These are all defined in other modular scripts and imported via `<script>` tags, which JSHint does not track.

No functional or structural issues were flagged, and the code was confirmed as valid and browser-ready.

![JSHint result for init.js](figures/validation/init.webp)  
*JSHint analysis summary for `init.js` showing no major issues and clean logic structure*

#### **`game.js` Results**

The `game.js` file contains the majority of Codoku’s interactive logic, including grid rendering, puzzle population, user input handling, win condition checking, timer management, and hint functionality. As the largest and most complex script in the project, it was particularly important to validate this file thoroughly to ensure it was well-structured, efficient, and error-free.

- **Functions defined**: 47  
- **Largest function**: 32 statements  
- **Cyclomatic complexity**: Max value = 11 (acceptable for a dynamic UI with multiple branches)  
- **Unused variable**:  
  - `startNewGame` (declared but not directly used within this file)  
- **Undefined variables**:  
  - `isSoundEnabled`  
  - `showAlertModal`  
  - `confetti`  
  - `bootstrap`  

These undefined variables are expected and justified:
- `isSoundEnabled`, `showAlertModal` are defined in separate utility files (`sound.js`, `init.js`)
- `confetti` comes from a third-party script
- `bootstrap` refers to Bootstrap’s modal functionality imported via CDN

⚠️ One warning was generated:  
>> *Optional chaining is only available in ES11*  

```js
console.error('Error:', response?.responseText || 'No response');
```

This syntax checks whether the response object exists before attempting to access its responseText property. If response is undefined or null, the optional chaining prevents the script from throwing an error, and instead safely falls back to 'No response'. 

This is used to safely access response objects like `response?.responseText` and is supported in modern browsers. All modern browsers (Chrome, Firefox, Edge, Safari) fully support optional chaining. Since Codoku is intended for modern environments and ES6+ syntax is enabled, this is not a concern. However, to enhance compatibility with older browsers and avoid relying on this ES11-specific syntax, the logic was updated to a manual null check.

```js
if (response && response.responseText) {
    console.error('Error:', response.responseText);
} else {
    console.error('Error: No response');
}
```

This alternative performs the same check in a way that is compatible with ES5/ES6 environments. It ensures the error message is displayed correctly without relying on modern syntax. This change was made specifically in the `fetchSudokuBoard()` function to ensure broader browser support.

![JSHint result for game.js](figures/validation/game.webp)  
*JSHint validation for `game.js` showing clean structure, modular logic, and minor contextual warnings*

#### **`navbar.js` - Results**

The `navbar.js` file manages sound feedback and the responsive collapse behavior of the navigation bar, particularly for mobile users. It also provides logic for detecting external clicks and intercepting in-app navigation events to enhance UX and avoid accidental game loss.

- **Functions defined**: 11  
- **Cyclomatic complexity**: Max value = 7 (within acceptable limits for UI event logic)  
- **Unused variable**:  
  - `setupOutsideNavbarCollapse` (used externally from `init.js`)  
- **Undefined variables**:  
  - `isSoundEnabled`  
  - `bootstrap`  

These warnings are considered **contextually valid**:
- `isSoundEnabled` is declared globally in `sound.js` and accessed here to control whether audio plays.
- `bootstrap` is included globally via the Bootstrap CDN and is used to trigger collapse and modal APIs, which are not explicitly imported in this script.

No syntax errors or structural flaws were found. The logic follows best practices for DOM event handling, modal interaction, and clean integration with Bootstrap’s JavaScript components.

![JSHint result for navbar.js](figures/validation/navbar.webp)  
*JSHint validation for `navbar.js` showing minor external reference warnings and otherwise clean structure*

#### **`setup-modal.js` - Results**

The `setup-modal.js` file is a concise script responsible for linking the "Start" button in the setup modal to game initialization. When the button is clicked, it closes the modal using Bootstrap's modal API and then starts a new Codoku session by calling the `startNewGame()` function. This ensures a smooth and clean transition from setup to gameplay.

- **Functions defined**: 2  
- **Largest function**: 5 statements  
- **Cyclomatic complexity**: 2 (very low, indicating clean control flow)  
- **Unused variable**:  
  - `setupStartButton` (declared but called externally by `init.js`)  
- **Undefined variables**:  
  - `bootstrap` (used for modal interaction via CDN)  
  - `startNewGame` (defined elsewhere in `game.js`)

These undefined variables are expected in this context:
- Bootstrap's modal system is accessed via a global `bootstrap` object from the CDN.
- The `startNewGame` function is declared globally in another file and called here to initialize gameplay.

JSHint flagged no functional errors or warnings in this file. The script is clean, minimal, and integrates well with the wider codebase.

![JSHint result for setup-modal.js](figures/validation/setup-modal.webp)  
*JSHint validation for `setup-modal.js` confirming clean logic, appropriate modularity, and no critical issues*

#### **`sound.js` - Results**

The `sound.js` file manages the user’s sound preferences for the application. It initializes sound settings, syncs UI controls with saved preferences using `localStorage`, and ensures the toggle state persists across sessions. Although it doesn’t directly handle audio playback, it defines a global flag (`isSoundEnabled`) used throughout other modules to conditionally play sounds.

- **Functions defined**: 3  
- **Largest function**: 7 statements  
- **Cyclomatic complexity**: 5 (well within normal range for conditional UI logic)  
- **No unused or undefined variables** were flagged.  
- **No warnings or errors** were returned by JSHint.

All logic is encapsulated and cleanly separated into modular functions (`applySoundSetting`, `setupSoundToggle`), enhancing maintainability and ensuring predictable behavior across the app. The `DOMContentLoaded` listener ensures correct initialization before any interaction can occur.

![JSHint result for sound.js](figures/validation/sound.webp)  
*JSHint output for `sound.js` confirming clean, modular sound preference logic and no issues detected*

#### **`theme.js` - Results**

The `theme.js` script is responsible for managing the application's visual theme toggle (light/dark mode). It reads from `localStorage` to apply the user's previously selected theme on page load and dynamically updates the UI theme, switch state, button styles, and accessibility settings.

- **Functions defined**: 5  
- **Largest function**: 8 statements  
- **Cyclomatic complexity**: 5 (expected for conditional UI rendering)  
- **Undefined variable**:  
  - `isSoundEnabled` (declared globally in `sound.js`)  
- **No unused variables** or errors were detected.

The script is clean, well-commented, and uses modular logic to keep the theme functionality separated from the rest of the app. jQuery is used to streamline DOM manipulation, and the script also incorporates audio feedback through conditional playback of themed sound effects ("tweet" for light, "hoot" for dark).

![JSHint result for theme.js](figures/validation/theme.webp)  
*JSHint analysis of `theme.js` confirming one globally declared dependency and otherwise sound, accessible logic*

### **6.2 Accessibility Testing**

Accessibility is a core consideration in the development of Codoku, ensuring that the game is usable by people of all abilities and assistive technologies. The goal was to create an inclusive experience by following the principles of WCAG 2.1 (Web Content Accessibility Guidelines), focusing on perceivability, operability, understandability, and robustness.

Accessibility testing was conducted using both **automated tools** and **manual techniques** to evaluate:

- **Semantic HTML structure** - Ensuring that elements such as headings, landmarks, and lists follow a logical order and meaningful structure.

- **ARIA roles and labels** - Verifying that interactive components (e.g. modals, toggles, buttons) use appropriate `aria-*` attributes for screen reader compatibility.

- **Keyboard navigation** - Manually testing tab order, focus states, and accessibility of all interactive elements without using a mouse.

- **Color contrast and visual clarity** - Validated via automated tools and manual inspection to meet contrast ratio requirements, especially between text and background in both light and dark modes.

- **Alt text for images** - Confirming that all decorative and informative images include appropriate `alt` attributes to provide context to screen reader users.

- **Screen reader simulation** - Using NVDA to assess how the application content is announced and navigated.

#### **Tools Used for Accessibility Testing**

| Tool | Description |
|------|-------------|
| [WAVE Web Accessibility Evaluation Tool](https://wave.webaim.org/) | Identifies structural and semantic issues, including missing alt attributes, headings, and ARIA landmarks. |
| [Accessibility Checker by CKSource](https://www.accessibilitychecker.org/) | Provides quick audits and visual feedback on accessibility issues in real time. |
| [Google Chrome Lighthouse](https://developer.chrome.com/docs/lighthouse) | Generates automated accessibility reports covering contrast, ARIA usage, keyboard support, and more. |
| [axe DevTools (Deque Systems)](https://axe.deque.com/install-success) | Browser extension used in developer tools to find and explain WCAG violations within the app. |
| [NVDA (NonVisual Desktop Access)](https://www.nvaccess.org/about-nvda/) | Screen reader for Windows used to test how visually impaired users experience and navigate the app. |

### **6.2.1 WAVE Accessibility Testing**

[WAVE](https://wave.webaim.org/) (Web Accessibility Evaluation Tool) is an automated tool developed by WebAIM for assessing accessibility issues directly within web pages. It identifies errors, warnings (alerts), structural elements, and ARIA usage while visually overlaying them on the interface for quick interpretation.

#### **`index.html` Results**

The following results summarize the evaluation of `index.html` using WAVE, along with screenshots that document the results and key observations.

![WAVE summary result](figures/wave/summary.webp)   
*WAVE accessibility summary for index.html showing no errors and several structural or semantic suggestions*

#### ⚠️ Alerts
The majority of alerts were related to *Possible heading* issues.

WAVE flagged 61 elements due to the use of visually prominent styles (e.g. bold or larger text inside `<p>` tags) in the Sudoku grid. These elements were interpreted as potential headings even though they were intentionally not semantic headings.

![Cell grid elements flagged by wave](figures/wave/alerts.webp)  
*WAVE accessibility scan showing multiple "possible heading" alerts (orange h? icons) across a Sudoku grid.*

These alerts do not indicate code errors but are suggestions to assess whether additional heading structure might benefit assistive technology users. In this case, the elements should not be semantic headings, as they represent game data and not content sections. The alert was reviewed and accepted as not requiring a change.

Wave also flagged 2 *HTML5 audio/video* alerts. These refer to the use of `<audio>` elements. WAVE flags these to ensure that alternative content is present for users with hearing impairments or that audio is not played automatically. In **Codoku** these `<audio>` tags are responsible for the `error` and `timeout` alert sounds which are non-autoplay and do not contain controls as they are programmatically operated.

#### ✅ Accessibility Enhancements
| Feature Type   | Count | Explanation                                                                 |
|----------------|-------|-----------------------------------------------------------------------------|
| Form Labels    | 9     | Each toggle or radio input has an associated `<label>`.                     |
| Fieldsets      | 3     | Radio inputs (difficulty, timer) are grouped in `<fieldset>` containers.   |
| Language       | 1     | `lang="en"` is declared in the `<html>` tag for screen reader compatibility.|

![13 features identified by wave](figures/wave/features.webp)  
*Accessibility features detected by WAVE such as labels, fieldsets, and language setting.*

These features improve screen reader interpretation, group related content meaningfully, and promote proper pronunciation of content.

#### 🧱 Semantic Layout
| Element Type       | Count | Purpose                                                                   |
|--------------------|-------|---------------------------------------------------------------------------|
| Heading Level 1    | 2     | Used for top-level titles (e.g., modals or main page header).             |
| Heading Level 2    | 36    | Used for modal titles, section headers, and UI labels.                    |
| Unordered Lists    | 2     | Represent bullet points or grouped navigation content.                    |
| **Semantic Landmarks** |||
| - Header           | 1     | Defines site or app banner at top of page.                                |
| - Navigation       | 1     | Provides primary nav links for the app.                                   |
| - Main             | 1     | Contains central game content.                                            |
| - Footer           | 1     | Houses credits and external links.                                        |
| - Aside            | 3     | Includes supporting areas like settings, rules, or instructions.          |

![Semantic headings and structural elements](figures/wave/structural-elements.webp)   
*Clear document structure with semantic use of headers, landmarks, and layout roles enhancing screen reader performance.*

These elements support keyboard and screen reader navigation by defining meaningful page structure.

#### 🗣️ Assistive Tech Support
A total of 53 ARIA attributes were identified, used appropriately across the interface.

| ARIA Type             | Example Use                                         |
|-----------------------|-----------------------------------------------------|
| `aria-label` / `aria-labelledby` | Describes toggles and modal labels               |
| `aria-describedby`    | Links inputs or modals to descriptions               |
| `aria-hidden`         | Hides decorative or duplicate elements               |
| `aria-expanded`       | Indicates state of collapsible content               |
| `aria-controls`       | Links toggles to their target elements               |
| `aria-live`           | Ensures dynamic feedback is announced                |
| `aria-tabindex`       | Manages keyboard focus behavior                      |

![ARIA attributes identified in WAVE](figures/wave/aria.webp)  
*WAVE detected 53 properly used ARIA attributes supporting accessibility, including labels, hidden states, and live regions.*

No misuse, duplication, or inconsistencies were found during the ARIA attribute audit. These attributes significantly improve context for users relying on screen readers.

#### ⌨️ Keyboard Accessibility
Using WAVE’s Order panel, the keyboard tab order was confirmed to be logical, linear, and intuitive. The navigation follows a top-to-bottom, left-to-right flow that matches the visible layout.

![Navigation order panel showing tab sequence](figures/wave/navigation-order.webp)  
*Logical and sequential keyboard navigation order as tested through WAVE’s Order panel, ensuring user-friendly interaction.*

This ensures that users navigating by keyboard or screen reader can access all functions without confusion or disorientation.

#### **👁️ Contrast Validation**
The WAVE contrast checker evaluates color pairings against the [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) contrast criteria:

- **WCAG AA**: Minimum contrast ratio of **4.5:1** for normal text
- **WCAG AAA**: Minimum contrast ratio of **7:1** for enhanced accessibility

![Contrast test result](figures/wave/contrast.webp)  
*WAVE contrast checker result for Codoku showing high readability and full WCAG compliance*

This result indicates that the interface text meets both standard and enhanced guidelines for readability.
