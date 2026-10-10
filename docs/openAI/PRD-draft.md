# License to Surf — Product Requirements Document

**Status:** Draft v0.1  
**Date:** 10 October 2026  
**Product type:** Free, non-commercial, browser-based digital literacy learning game  
**Working title:** License to Surf

## 1. Product overview

### 1.1 Product vision

License to Surf is a playful, interactive web experience that helps people become more confident, capable, safe, critical, and considerate internet users.

Instead of presenting digital literacy as a conventional online course, License to Surf turns learning into an exploration game. Players visit locations, meet characters, investigate situations, make decisions, and discover the consequences of their choices in a safe, fictional environment.

The experience combines practical digital skills with online safety, privacy, media literacy, and responsible online participation.

The ultimate reward is a **License to Surf**: an informal certificate recognizing the skills a player has practised and demonstrated within the experience.

### 1.2 The problem

People increasingly need digital skills to participate in everyday life, but not everyone has had the opportunity to develop them. Existing educational resources can be fragmented, overly text-heavy, narrowly focused on cybersecurity, designed primarily for schools, or presented in a way that feels like corporate training.

People may know that they should be careful online without knowing what to look for or what to do in a real situation.

For example:
- How can someone tell which part of a URL identifies the actual website?
- What should someone do when an unexpected message asks them to log in urgently?
- How can someone check whether an online claim is trustworthy?
- What should someone consider before sharing personal information, a photograph, or their location?
- What can someone do after clicking a suspicious link?

License to Surf aims to bridge the gap between knowing general advice and being able to apply it.

### 1.3 Product goals

1. **Build practical competence.** Help players recognize situations, make informed decisions, and know what to do next.
2. **Make learning enjoyable.** Use exploration, narrative, humour, visual discovery, and interactive challenges.
3. **Build confidence.** Make experimentation and mistakes safe, understandable, and free of shame.
4. **Serve a broad audience.** Make the experience useful to people with different ages, abilities, and levels of digital confidence.
5. **Reuse established knowledge responsibly.** Base learning objectives on reputable frameworks and resources rather than reinventing the curriculum.
6. **Respect users.** Minimize data collection and avoid manipulative engagement mechanics.
7. **Stay sustainable.** Build a small, maintainable first release that can be hosted and operated at little or no cost.

### 1.4 Non-goals

The product is not intended to be:
- Corporate cybersecurity compliance training.
- A replacement for professional cybersecurity training or support.
- An official qualification, accreditation, or guarantee that someone is safe online.
- A comprehensive course covering every aspect of digital technology.
- A platform for real users to chat, share personal information, or compete publicly.
- A phishing simulator that sends real deceptive messages.
- A collection of copied third-party lessons or games.
- An engagement-maximizing product built around streaks, notifications, or compulsive use.

## 2. Target audience

### 2.1 Primary audience

The initial audience is the **general public, especially people who would benefit from improving their digital confidence or practical online safety skills**.

This includes:
- Teenagers learning to navigate increasingly complex online environments.
- Adults who want to feel more confident using the internet.
- Older adults and people with limited digital experience.
- People who use digital services regularly but have gaps in their understanding.

The initial experience should not assume that every player is a complete beginner or that every older user lacks digital skills.

### 2.2 Audience principles

- Treat users as capable people who may simply not have learned a particular skill yet.
- Explain unfamiliar terminology in plain language.
- Avoid making the game feel childish, patronizing, or intimidating.
- Let players take their time and use hints.
- Avoid assuming that everyone uses the same devices, services, or social platforms.
- Include different ages, backgrounds, abilities, and circumstances in examples and characters.
- Use fictional services and identities in scenarios wherever practical.

The first release should be broadly accessible rather than attempting to create separate, fully customized courses for every age group.

### 2.3 Illustrative user needs

**A cautious beginner:** “I want to know what to look for before clicking something unfamiliar.”

**A confident but busy user:** “Give me a short, interesting challenge that teaches me something useful.”

**A teenager:** “Help me handle real online situations without lecturing me.”

**An older adult:** “Let me practise at my own pace without feeling embarrassed about getting something wrong.”

These are design hypotheses to validate, not claims that all members of these groups share the same needs.

## 3. Product concept and experience

### 3.1 Core concept: explore a digital town

The main experience is a small fictional town, provisionally called **Webville**.

A character stands at an intersection, with different locations representing areas of digital life. Players select a location to discover a short interactive mission.

The visual direction is inspired by late-1980s and early-1990s point-and-click adventure games: expressive pixel art, memorable environments, environmental clues, dry humour, and a sense of discovery.

The inspiration is genre-level rather than a reproduction of any existing game's characters, artwork, dialogue, branding, or distinctive assets. The tone should be witty and appealing to adults and teenagers without relying on adult humour or becoming childish.

### 3.2 Proposed locations

| Location | Learning themes | Example missions |
|---|---|---|
| Browser Café | Browsers, tabs, URLs, search, bookmarks, downloads | Find the Impostor; Navigate the Browser |
| Security Agency | Phishing, suspicious links, account security, updates, permissions | The Suspicious Message; Secure the Account |
| Social Square | Privacy, sharing, group chats, bullying, consent, online relationships | The Group Chat; Before You Share |
| Digital Library | Search quality, misinformation, source evaluation, manipulated media | Check the Claim; Find the Original Source |
| Keyboard Arcade | Basic computer skills, files, folders, keyboard shortcuts | Find the Missing File |
| License Office | Practical assessment and certificate | The Final Check |

These locations are the proposed long-term world, not a commitment to build every location in the MVP.

### 3.3 Navigation and accessibility

The illustrated town map is the primary navigation experience, but it must not be the only way to navigate.

Players must also be able to access the same locations and missions through a straightforward list or menu. All important functionality must be usable without relying on pixel art, spatial positioning, dragging, or visual clues alone.

The map should be enjoyable exploration, not a barrier to learning.

### 3.4 Mission loop

Each mission should generally take approximately 2–5 minutes.

A typical mission follows this loop:

1. **Encounter:** A character or situation introduces a practical problem.
2. **Investigate:** The player examines relevant information, clues, or options.
3. **Decide:** The player chooses an action or explains a judgement.
4. **Discover:** The game explains the likely consequences of the decision.
5. **Learn:** The player receives a concise explanation of the underlying principle.
6. **Retry or transfer:** The player can try again or apply the skill to a different example.
7. **Recognize progress:** A passport stamp or similar achievement records the completed skill.

Not every mission needs to follow the exact same format. Variety is desirable as long as the learning objective remains clear.

### 3.5 Feedback philosophy

Feedback should explain *why* an answer is helpful or risky, not simply label it right or wrong.

For example:

Instead of “Wrong! You clicked a dangerous link,” use “The familiar company name is part of a longer address. Look at the actual hostname before deciding which site you are visiting.”

Players must be allowed to make mistakes, request hints, retry, and revisit explanations without losing progress or being shamed.

Some online situations are genuinely ambiguous. Where several responses could be reasonable, the game should acknowledge that and explain the trade-offs instead of pretending that every situation has one universally correct answer.

## 4. Learning objectives and curriculum

The curriculum will be informed by established digital competence and online safety resources, including the European Commission's DigComp framework, ENISA guidance, Better Internet for Kids, UNESCO media and information literacy resources, and relevant educational materials from Common Sense Education.

The curriculum should be mapped to specific, observable learning outcomes. Resources provide the evidence and source material; License to Surf determines how to turn those outcomes into original interactive experiences.

### 4.1 Proposed curriculum

**Module A — Navigate the web**

Players should be able to:
- Recognize the main parts of a browser interface.
- Understand the basic structure of a URL.
- Identify the hostname in an address.
- Distinguish a genuine domain from a misleading subdomain or other deceptive URL.
- Use search results thoughtfully and recognize that ranking does not prove reliability.
- Understand basic browser concepts such as tabs, bookmarks, downloads, and files.

**Module B — Spot suspicious messages and links**

Players should be able to:
- Recognize common warning signs in unexpected messages.
- Consider the sender, context, requested action, destination, and use of urgency.
- Choose a safer way to verify an unexpected request.
- Understand that HTTPS does not guarantee that a site is honest.
- Identify appropriate next steps after opening a suspicious link or entering information on a questionable site.

**Module C — Protect accounts and devices**

Players should be able to:
- Explain why passwords should be long and unique.
- Understand the role of a password manager.
- Understand multi-factor authentication and passkeys at an introductory level.
- Recognize why software updates and careful permission choices matter.
- Avoid entering real passwords or sensitive personal information into learning exercises.

**Module D — Share thoughtfully**

Players should be able to:
- Identify personal information that may be sensitive in a given context.
- Consider the implications of sharing photographs, locations, screenshots, and identifying details.
- Understand that privacy settings reduce some risks but cannot guarantee control over shared content.
- Recognize appropriate ways to respond to bullying, unwanted contact, or pressure to share something.
- Understand how to seek help and report harmful behaviour when appropriate.

**Module E — Evaluate information**

Players should be able to:
- Distinguish a claim from evidence supporting that claim.
- Check who published information, when it was published, and what evidence is offered.
- Seek independent confirmation for important claims.
- Recognize that images, audio, and video can be manipulated or AI-generated.
- Understand that a convincing appearance does not prove authenticity.

Module E is a likely expansion area if it cannot be developed to a good standard within the first release.

### 4.2 Curriculum sequencing

The recommended sequence is:

1. Web navigation and URL literacy.
2. Suspicious messages and safe actions.
3. Account and device security.
4. Privacy and social interaction.
5. Information evaluation and manipulated media.

Players should be able to revisit completed lessons. Progression should support a coherent learning journey without unnecessarily locking people out of useful information.

### 4.3 Content standards

Each mission must have a content specification containing:

- Mission ID and title.
- Learning objective.
- Intended audience and assumed prior knowledge.
- Scenario and context.
- Player decisions and available actions.
- Correct, acceptable, or context-dependent responses.
- Feedback and explanations.
- Hints and retry behaviour.
- Assessment criteria.
- Source references and review date.
- Content owner or reviewer, where applicable.
- Licensing and attribution notes for any third-party material.

Cybersecurity and platform-specific advice can become outdated. Content must be reviewable and easy to update without rewriting the entire application.

## 5. MVP scope

### 5.1 MVP objective

Demonstrate that a small, polished slice of License to Surf can make practical digital literacy learning feel like an enjoyable adventure—and that players can apply what they learn to a new situation.

The MVP should validate the concept before committing to a large world or extensive curriculum.

### 5.2 Must-have features

**Experience**
- A welcoming home screen that explains the concept.
- A small illustrated town map.
- An accessible alternative list-based navigation.
- A consistent visual style and a small amount of narrative context.
- Responsive layouts for desktop, tablet, and mobile browsers.

**Learning**
- One fully developed, playable mission: **Find the Impostor**.
- A mission introduction, interactive investigation, decision, explanation, and retry flow.
- Hints that help players reason through the problem.
- A new example that tests whether the player can transfer the learned skill.
- A concise end-of-mission summary.

**Progress**
- A simple digital passport showing completed missions or earned stamps.
- Progress retained locally in the browser where practical.
- No login requirement.
- No public leaderboard or social sharing requirement.

**Accessibility and privacy**
- Keyboard-operable controls.
- Screen-reader-friendly structure and labels.
- Text resizing and readable contrast.
- No essential information conveyed by colour alone.
- No time pressure required to complete the mission.
- No collection of real credentials or sensitive personal information.
- No third-party advertising.

**Quality**
- Clear loading, error, retry, and navigation states.
- A simple way to restart a mission.
- Basic automated checks and manual accessibility testing.
- Content and gameplay separated sufficiently that new scenarios can be added without duplicating the entire interface.

### 5.3 Should-have features

If time permits:
- One short phishing-message mission.
- One small social-sharing or privacy scenario.
- A short introductory narrative connecting locations.
- A printable or downloadable completion certificate.
- A small content-source or credits page.

These should not delay validation of the core experience.

### 5.4 Out of scope for the MVP

- Every proposed town location and curriculum module.
- User accounts, cloud-synced progress, or social profiles.
- Multiplayer, real-time chat, or user-generated content.
- Public leaderboards, streaks, or competitive rankings.
- A full avatar customization system.
- A large branching narrative.
- A complex learning management system.
- A custom analytics backend.
- Real phishing emails, live website scanning, or real account integration.
- Official accreditation or claims of certified cybersecurity competence.
- A fully featured typing tutor.
- Broad localization beyond the initial language.

## 6. Detailed functional requirements

Priority definitions: **P0** = required for MVP; **P1** = desirable for MVP; **P2** = future consideration.

### FR-01: Start and explore

**Priority:** P0

The player can start without creating an account, read a brief introduction, and select a location or mission.

**Acceptance criteria**
- The purpose of the game is understandable without reading a long introduction.
- The map exposes the available destinations.
- An equivalent list or menu exposes the same destinations.
- Locked or unavailable locations are clearly identified without suggesting that the application is broken.
- The player can return to the map from a mission.

### FR-02: Play a mission

**Priority:** P0

The player can complete a mission using supported controls, receive feedback, and retry.

**Acceptance criteria**
- Each decision has a clear prompt and understandable options.
- The player can request a hint where hints are supported.
- Feedback explains the reasoning behind the outcome.
- The player can retry without a penalty.
- The player can leave and return without becoming trapped in a flow.
- The mission works without drag-and-drop or time-limited input.

### FR-03: Find the Impostor

**Priority:** P0

The player investigates URLs and identifies the website actually represented by each address.

The mission must teach the distinction between a hostname and a familiar-looking word that merely appears somewhere in a URL.

Illustrative examples:

- `https://microsoft.com.attacker.example/login` — the hostname is `microsoft.com.attacker.example`; the registrable domain is `attacker.example`.
- `https://microsoft.com@attacker.example/login` — the hostname is `attacker.example`.

Examples must be validated during content authoring and accompanied by a clear explanation of how URL parsing works.

**Acceptance criteria**
- The mission includes several different URL patterns, not just one memorized trick.
- The player can inspect and read the complete address.
- The player is guided to examine the actual hostname.
- The explanation distinguishes the hostname from the registrable domain where relevant.
- The lesson does not imply that every unfamiliar domain is malicious or that a familiar brand name is sufficient evidence of trustworthiness.
- The lesson explains that HTTPS protects the connection but does not prove that the website is legitimate.
- The player receives a new, unseen example to assess after the main exercise.

### FR-04: Digital passport

**Priority:** P0

The application records mission completion and displays the associated passport stamp.

**Acceptance criteria**
- Completion is based on the mission's defined learning criteria, not merely on opening a screen.
- The passport makes progress understandable.
- Players can revisit missions.
- Progress can be reset deliberately.
- Local progress is retained across ordinary page reloads where supported.
- Progress is not transmitted to a server in the MVP.

### FR-05: Content extensibility

**Priority:** P0

Mission content should be represented in a reusable structure rather than being embedded throughout presentation code.

**Acceptance criteria**
- A new mission can reuse shared presentation and interaction components where appropriate.
- Scenario text, options, hints, feedback, and learning objectives are easy to locate and revise.
- Content has stable IDs.
- The structure supports more than one type of interaction where practical.
- Content can reference its sources and review date.

The implementation should remain proportionate to the MVP. A sophisticated content management system is not required.

### FR-06: Certificate

**Priority:** P1

The application can provide a License to Surf completion certificate after the player meets the defined requirements.

**Acceptance criteria**
- The certificate identifies itself as an informal educational achievement.
- It does not imply accreditation, employment qualification, or a guarantee of safety.
- It avoids requiring a real name or email address.
- If downloadable, it can be generated locally where practical.
- The completion criteria are transparent.

### FR-07: Optional expanded missions

**Priority:** P1

The architecture can accommodate further missions, such as a phishing inbox or a privacy scenario, without requiring a redesign of the entire application.

These missions should be added only after the first mission and navigation model have been tested.

## 7. Non-functional requirements

### 7.1 Accessibility

Target **WCAG 2.2 Level AA** as the accessibility goal, subject to testing and review.

Requirements include:
- Semantic page structure and meaningful headings.
- Full keyboard navigation and visible focus.
- Appropriate accessible names and instructions for interactive controls.
- Screen-reader-compatible feedback and status changes.
- Text zoom and responsive reflow.
- Sufficient text and interface contrast.
- No reliance on colour, sound, animation, or spatial position alone.
- Respect for reduced-motion preferences.
- No flashing effects or unnecessary animated distractions.
- Alternatives to visually dependent puzzles and drag-and-drop.
- Plain-language instructions and manageable amounts of text.

Accessibility must be considered during design and development, not added as a final patch.

### 7.2 Performance and compatibility

- The game should work in current mainstream desktop and mobile browsers.
- The experience should remain usable on ordinary consumer devices and modest connections.
- Art assets should be optimized and unnecessary dependencies avoided.
- The core learning experience should not depend on video streaming, large downloads, or advanced hardware.
- Browser storage failures should not prevent access to the learning content.

Specific performance budgets and browser support targets should be set once the implementation approach is selected.

### 7.3 Privacy and security

The default architecture is privacy-first.

- No account is required.
- No personal profile is required.
- No real passwords, payment details, or sensitive personal information are requested.
- Progress is stored locally where feasible.
- No advertising trackers or third-party behavioural analytics are required.
- No personal information is shared publicly.
- External links are clearly identified.
- Third-party dependencies are kept to a minimum and reviewed.
- Any future analytics, accounts, or server-side storage require a separate privacy review and explicit product decision.

Local storage is not a secure vault. The application should store only non-sensitive progress information and should explain how to reset it if needed.

Because minors may use the product, data protection and child-safety requirements must be reviewed for the intended deployment jurisdictions. A free educational purpose does not automatically remove legal obligations.

### 7.4 Maintainability

- Keep learning content separate from UI logic where practical.
- Use a small number of well-defined reusable components.
- Avoid introducing a backend unless a demonstrated requirement justifies it.
- Document how to add, review, and test a mission.
- Keep source attribution and licensing information with the relevant content.
- Make it straightforward to update a lesson when guidance changes.

## 8. Game design requirements

### 8.1 Progression

Progress should represent exploration and growing competence, not time spent in the application.

Potential mechanics include:
- Passport stamps for demonstrated skills.
- New locations becoming available as the world expands.
- Recurring characters and small narrative threads.
- Environmental clues and fictional inventory items, such as a magnifying glass for examining URLs.
- Optional challenges for players who want to explore further.

### 8.2 Rewards

Rewards should reinforce meaningful learning. A stamp should communicate what the player has practised or demonstrated.

Avoid:
- Punitive failure states.
- Loss of progress for mistakes.
- Daily streaks or urgency-driven notifications.
- Public rankings.
- Reward systems that encourage guessing quickly rather than reasoning carefully.

The research reviewed for this project suggests that gamification can support motivation, but effects vary and increased engagement is not the same as increased competence. The product must validate learning outcomes directly.

### 8.3 Tone and narrative

The game should feel curious, warm, witty, and slightly mischievous.

Use fictional characters and everyday situations to make abstract concepts concrete. Avoid fearmongering, victim blaming, stereotypes, and jokes at the expense of people who lack digital skills.

## 9. Content sourcing, licensing, and accuracy

The project should use existing frameworks to define learning outcomes and use established resources to check the accuracy of explanations.

Initial reference points include:

- European Commission — [DigComp](https://joint-research-centre.ec.europa.eu/digcomp_en)
- ENISA — [Cybersecurity education](https://www.enisa.europa.eu/topics/education-and-career-path/cybereducation-platform)
- Better Internet for Kids — [European online safety resource](https://better-internet-for-kids.europa.eu/en)
- UNESCO — [Media and Information Literacy](https://www.unesco.org/mil4teachers/en/introduction)
- Common Sense Education — [Digital Literacy and Well-Being](https://www.commonsense.org/education/digital-literacy/about)
- Research on gamification — [Systematic review and meta-analysis](https://link.springer.com/article/10.1007/s11423-023-10337-7)

Potential games such as CyberNinja and Be Internet Awesome can be reviewed for ideas about interaction, pacing, and learning design.

**Licensing rule:** Publicly accessible or free-to-use material is not automatically licensed for copying, modification, or redistribution. Before reusing any text, images, audio, code, or other assets, verify the specific license and attribution requirements. When reuse rights are unclear, link to the original resource or create original material based on the underlying learning objective.

The project should maintain a simple source register recording the resource, relevant learning objective, license or terms, attribution requirements, and last review date.

## 10. Evaluation and success criteria

The MVP should be evaluated on whether people can use it, enjoy the experience, and learn something they can apply elsewhere.

### 10.1 Usability

Test whether participants can:
- Understand the game's purpose.
- Find and start the mission.
- Identify the available controls and hints.
- Complete the exercise without assistance or explain where they became stuck.
- Navigate using the alternative menu if they do not use the map.

### 10.2 Learning

Use a short assessment before and after the mission, followed by a transfer task with an unfamiliar example.

Evaluate:
- Whether players can identify the relevant part of a URL.
- Whether they can explain the reasoning behind their decision.
- Whether they can apply the principle to a different URL structure.
- Whether they understand a practical next step rather than merely recognizing a quiz answer.

Do not treat a high score on the same questions repeated immediately as sufficient evidence of learning.

### 10.3 Initial validation targets

The following are provisional targets for early testing, not established benchmarks:

- Most participants can start and complete the mission without moderator intervention.
- Participants can explain the central URL principle in their own words.
- Participants perform better on a new transfer example after the lesson.
- Participants with different levels of digital confidence can navigate the experience.
- Participants describe the tone as respectful and the experience as engaging rather than patronizing.
- No critical accessibility, privacy, or content accuracy problems remain unresolved.

Begin with approximately 5–10 diverse participants for qualitative usability testing. This is useful for identifying design problems, not for proving effectiveness across the general population.

If children participate in research, use appropriate consent, safeguarding, and age-appropriate procedures.

### 10.4 Metrics to avoid overvaluing

Do not optimize primarily for:
- Time spent in the app.
- Number of clicks.
- Streak length.
- Public scores.
- Return frequency without evidence of learning.
- A recommendation score detached from actual usability and educational outcomes.

Voluntary return visits can be informative, but they are not a substitute for measuring competence.

## 11. Proposed implementation approach

The MVP should be a lightweight web application that can be deployed as a static site.

### 11.1 Architecture principles

- Prefer a simple frontend and static hosting.
- Avoid a backend unless a concrete need emerges.
- Store only minimal, non-sensitive progress locally.
- Keep mission content in a reusable data structure.
- Separate content validation from UI rendering.
- Use ordinary accessible web controls wherever possible.
- Optimize for reliability, maintainability, and low operating cost.

The specific framework and game library remain open decisions. The product should not require a game engine simply because it looks like a game. A conventional web application with carefully designed interactions may be sufficient.

### 11.2 Suggested development sequence

**Phase 1 — Define and verify**
- Finalize the first mission's learning objectives.
- Verify its technical content and examples.
- Confirm asset licensing and attribution.
- Sketch the map, mission, feedback, and passport screens.

**Phase 2 — Build the vertical slice**
- Implement navigation and its accessible alternative.
- Build the complete Find the Impostor mission.
- Implement feedback, hints, retries, and a transfer task.
- Add the passport stamp and local progress.

**Phase 3 — Test and refine**
- Test on desktop and mobile.
- Test keyboard and screen-reader interaction.
- Conduct initial user sessions.
- Fix confusing instructions, inaccessible interactions, and weak learning explanations.

**Phase 4 — Decide what to expand**
- Review usability and transfer results.
- Decide whether to add a phishing mission, privacy scenario, or another foundational module.
- Update the PRD based on evidence.

## 12. Key risks and mitigations

| Risk | Mitigation |
|---|---|
| The town map is attractive but confusing | Provide a list-based alternative and test navigation early. |
| The game feels too childish or too much like corporate training | Test the visual style and tone with people from different age groups. |
| Players memorize patterns without understanding them | Use varied examples and transfer tasks. |
| Security advice becomes outdated | Record sources and review dates; make content easy to revise. |
| Third-party content is reused without permission | Verify licenses and use original content where necessary. |
| Gamification distracts from learning | Reward demonstrated skills and measure competence directly. |
| The MVP grows into a large game before the concept is validated | Build one complete mission before expanding the world. |
| Accessibility is compromised by the pixel-art interface | Treat accessibility as a functional requirement and provide equivalent non-visual navigation. |
| User data creates unnecessary risk | Start without accounts, tracking, or server-side progress. |
| The certificate is mistaken for official accreditation | Clearly describe it as an informal educational achievement. |

## 13. Open decisions

These decisions should be resolved as the project moves from draft PRD to implementation.

1. **Initial language:** Should the first release be English-only, Norwegian, or another language?
2. **Primary device:** Should the initial design optimize for desktop, mobile, or both equally?
3. **First-release curriculum:** Should the MVP contain only Find the Impostor, or should it include one or two additional short missions?
4. **Audience positioning:** Should the public description explicitly target beginners, or present the game as useful for anyone who wants to sharpen their skills?
5. **Art production:** Should the first prototype use original pixel art, simple temporary assets, or a mix?
6. **Certificate:** Should the MVP include a printable certificate, or wait until there is a broader set of learning outcomes?
7. **Framework:** Which frontend approach best balances your existing development preferences, accessibility, maintainability, and deployment simplicity?
8. **Hosting and domain:** What zero-cost or low-cost deployment setup best fits the project?
9. **Content review:** Who will review security advice and learning content as the game grows?

These decisions should not block the first interactive prototype unless they directly affect its usability or technical feasibility.

## 14. Definition of MVP complete

The MVP is ready for an initial public release when:

- A player can enter the experience without an account.
- The town map and alternative navigation both work.
- Find the Impostor is complete, accurate, and playable from start to finish.
- The player receives useful feedback and can retry.
- The mission includes a new example to assess transfer of learning.
- The passport records completion without sending progress to a server.
- The experience works on supported desktop and mobile browsers.
- Keyboard access, readable text, and core screen-reader interactions have been tested.
- Privacy and content-source information are available.
- No unresolved critical accessibility, security, or educational accuracy issues remain.
- Initial user testing has informed at least one meaningful improvement.

## 15. Research-informed design rationale

This PRD draws on the Deep Research report and the product concept developed in earlier planning.

The research supports using established competence frameworks to define learning outcomes and using scenarios, feedback, safe experimentation, and achievable challenges to structure learning. It also suggests caution: gamification does not automatically produce better learning, and resources that are free to access may not be free to reuse.

The product therefore adopts three guiding principles:

1. **Teach transferable skills, not just correct answers.**
2. **Use game design to make learning inviting, not to pressure people into continued use.**
3. **Validate the smallest complete experience before investing in a larger game.**

The PRD should be revised as the first mission is prototyped, tested, and reviewed. It is a working product specification rather than a claim that all audience assumptions, curriculum priorities, or implementation choices have already been proven.

---

**End of draft PRD**