# VELOOP Rewards — Mining Badges

Submission-ready React + Vite prototype implementing the mentor review feedback.

## Mentor feedback implemented

- 30 badge levels now start **locked** at Level 00 / 0 of 30.
- **Complete Milestone** unlocks one badge at a time in sequence.
- **Reset** stops mining and returns the journey to 0/30, Level 01 preview, 0 session VE and the starting wallet balance.
- Mining is continuous while active: **+1 VE every second**. Pause stops the live interval.
- **Dashboard / Overview** is a functional view with live balance, badge progress and mining session data.
- **Wallet** is functional and reflects the live mining balance/session.
- **Search** is functional for level, tier, identity and stage.
- **Settings** has functional notification, compact-grid and reduced-motion controls plus a reset action.
- Badge artwork uses individual transparent WebP assets.
- Responsive layouts adapt across desktop, tablet and mobile.
- Heavy development folders such as `.opencode`, `node_modules`, `dist` and `.git` are intentionally excluded from the submission ZIP. Run `npm install` locally before starting.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run check
npm run build
```

## Interaction flow for mentor review

1. Open **Mine & Earn**.
2. Confirm the collection starts at **0/30** with locked badges.
3. Click **Start Mining Now** and leave it active. The session counter and wallet should increase by **1 VE every second**.
4. Click **Complete Milestone** to unlock Level 01, then repeat to demonstrate sequential progression.
5. Open **Overview**, **Wallet**, **Search**, and **Settings** from the navigation to verify they are real screens rather than placeholder toasts.
6. Use **Reset** and verify the journey returns to 0/30.
