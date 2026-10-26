# Screen patterns

Thirteen screen patterns from the Crossmedia unified portal. Each one shows how the rules in
[`SYSTEM.md`](SYSTEM.md) combine on a real screen. When a screen in the project does the same job,
build it from the matching pattern. Names, data and labels below are examples; the project's real
data replaces them, and a gap stays in brackets (`[CLIENT NAME]`).

Every pattern exists in light and dark.

## Shells

The frame around the screen content. Every screen uses exactly one shell.

- **Split shell** — sign-in only. Left column (about 40 %) in brand navy: light logo at the top,
  a Display headline, one supporting paragraph, three check-marked facts, and a footer line with
  copyright and support contact. Right column on the background colour: the form, centred, about
  360 px wide. This is the one place navy fills a large area.
- **Portal shell** — top bar only, no sidebar. Content margin 56 px. For home and launch screens.
- **Admin shell** — top bar plus 246 px sidebar. In the top bar, a neutral tag names the area
  ("Portal administration") next to the logo. The sidebar starts with "Back to the portal", then a
  micro-label group heading, then the links with an optional count on the right. A small notice
  card can sit at the bottom of the sidebar (for example "4 accounts without 2FA" with one link).
- **Account shell** — top bar plus 258 px sidebar, grouped under "My account". Sign out sits at
  the bottom in soft red.
- **Mobile shell** — 56 px top bar (logo, alerts, avatar) and the 76 px bottom navigation with
  four destinations. Sidebars become a list screen with a back chevron.

## 1. Sign-in

Split shell. Form order: title ("Sign in") and one-line help · the single-sign-on button as a
secondary button with the provider icon · an "OR WITH EMAIL" divider in micro-label type · email
field · password field with "Forgot it?" as a tertiary link on the label row and a show/hide icon
button inside the field · "Keep me signed in 8 hours" checkbox · one full-width primary button ·
a Secondary-size legal line under it, with the audit-log link.

## 2. Two-step verification

Split shell, same left column. A "Back" tertiary link at the top. Title, the account email in the
help line, a code field in Mono with large spaced digits, a live expiry countdown ("Expires in
00:23"), a "Trust this device for 30 days" checkbox with a warning line under it ("Leave it off on
shared computers"), one primary button, then fallback methods as a short list of tertiary links.

## 3. Home

Portal shell. Greeting headline (Screen title, informal is fine) with a one-line summary under it
("You have access to 6 tools · 1 in a maintenance window this week"). On the right of the
headline: the theme switch as a two-icon segmented control, and one secondary button for the admin
area. Then:

- Eyebrow "YOUR TOOLS" with a right-aligned Secondary note.
- The card grid: monogram (rounded square), status tag with dot at top right, tool name in Card
  type, a two-line description, then a footer rule with metadata on the left ("Last opened 2 h
  ago", or an amber line for maintenance windows) and the "Open ↗" tertiary action on the right.
  The whole card is the link.
- Eyebrow "NO ACCESS" with compact one-row cards: muted monogram, name, one line of reason, and
  a secondary "Request" button or a neutral "Pending" tag.

## 4. Launcher

A 392 px floating menu from the top-bar grid icon. Micro-label heading "GO TO A TOOL" with the
keyboard shortcut in a Mono pill. A 3-column grid of monogram over short name; the current tool
has a selected fill. A divider, then admin links with 17 px icons, then sign out in soft red.

## 5. Notifications panel

Side panel from the right, with the screen behind dimmed. Header: title, "Mark all as read"
tertiary link, settings icon button. Tabs under it ("Unread 3", "All", "Security"). Items grouped
under micro-label day headings ("TODAY", "THIS WEEK"). Each item: a 28 px tinted icon square in
the semantic colour of the event, one or two lines of text with the key names in 600, and a
Secondary meta line ("40 min ago · Operations") that can end in a link. Unread items carry the
3 px navy bar on the left. An item that needs a decision carries a small primary + secondary
button pair. Footer: "See full history" link on the left, "Alert preferences" on the right.

## 6. Settings form

Account shell. Screen title and one-line help. Content in cards: an avatar block (68 px avatar,
"Upload image" secondary button, "Use initials" tertiary), a divider, then a two-column field grid.
A locked field uses the disabled style with a lock icon and one help line saying who manages it.
A separate "Appearance" card holds the three theme options as large radio buttons (Light, Dark,
System). A fixed footer bar at the bottom of the content: "Last changed: 4 Sept 2026" on the left,
"Discard" secondary and "Save changes" primary on the right.

## 7. Security settings

Account shell. A success tag at top right sums up the state ("Account meets the policy"). One card
per concern:

- **Single setting** row: icon square, title, Secondary meta line, one secondary button on the
  right.
- **Method list** card: a heading with a right-aligned note ("Required for your role"), then one
  inner row per method on the raised surface — icon, name, meta line, an optional status tag, and
  one action. The recommended action may be primary; a warning sits in the meta line in amber.
- **Sessions** table: device and browser, a "This device" success tag, location, IP in Mono, and a
  right-aligned last-active time with a secondary "Close" button. The card heading carries a
  destructive "Close all others" button.

## 8. Admin list

Admin shell. Section title with a count summary under it ("48 accounts in 6 clients · 3 pending
invitations"). On the right: secondary "Import CSV" and primary "Invite user". Then:

- A filter row: search field, then one select per filter, then a toggle chip, and a right-aligned
  range note ("Showing 1–8 of 48").
- The bulk-action bar when rows are selected (see Tables in `SYSTEM.md`).
- The grid table: checkbox, person (avatar, name, email under it), client, role tag, tool monogram
  stack with `+N`, 2FA method as a word (red tag when missing), status with dot, last access, and
  the three-dot menu.
- A footer row: "7 of 48 users" on the left, pagination on the right (Previous, numbered pages with
  the current one in brand fill, Next).

## 9. Create panel

Side panel over the admin list. Header: title, one-line help, close button. Body sections under
micro-label headings ("PERSONAL DETAILS", "ORGANISATION AND ROLE", "TOOL ACCESS", "SIGN-UP AND
SECURITY"). Two-column field grid where it fits. A role select is followed by a selected-fill note
that explains what the role grants. Tool access is a two-column checkbox list; inherited items show
a small "inherited" note and unavailable ones are disabled with the reason. A choice between two
methods uses large radio cards. A switch row for a required setting. Fixed footer: an audit note
on the left ("This is recorded in the audit log"), "Cancel" secondary and the primary action on the
right.

## 10. Empty, no-results and error states

Inside the content card of any list screen.

- **Empty**: the flat geometric illustration, a title that says what is missing ("No users in this
  client yet"), one or two sentences that say what to do, a primary + secondary action pair, and
  one tertiary help link under them.
- **No results**: a compact card with a search icon square, a title that quotes the query, one
  hint line, a "Clear filters" secondary button and a tertiary alternative.
- **Load error**: a compact card with an error-tinted border and icon square, a micro-label
  "ERROR" eyebrow in red, a title saying what failed, one line with what the system did and the
  Mono reference (`ERR-7741`), a "Retry" primary button and a "See service status" tertiary link.

## 11. Detail beside a list

Admin shell. The list table takes about two thirds of the width; the selected row is highlighted
(fill plus the 3 px navy bar). The remaining third is an inline detail card, not an overlay:
header with monogram, name, "Edited 6 days ago by …" and a three-dot menu; editable fields;
technical blocks on the alternate surface with key–value rows in Mono (copy icon buttons beside
copyable values, an amber line for an expiring item); a radio choice; and a footer with a
full-width primary "Save" and a secondary test action.

## 12. Permission matrix

Admin shell, with tabs under the title ("By client", "By user", "Role templates"). A legend bar
explains the three cell states: checked (active), empty checkbox (contracted, not active), and an
em dash (not contracted). The matrix is a grid table: one row per client (logo slot, name, user
count) and one checkbox column per tool, centred. An internal row uses the brand monogram. Under
it, an "EXCEPTIONS BY USER" eyebrow with a note ("Always win over the client's inherited
access") and a normal table with a rule tag (Granted green, Denied red, Pending amber), a reason,
and an expiry date — amber when close, "No expiry" in tertiary text otherwise.

## 13. Audit log

Admin shell. Title, retention note, one secondary "Export CSV" button. Filters: search ("Actor,
resource or IP"), a period select, an action select, a result select, and a right-aligned event
count. The table: timestamp in Mono, actor (a "SYS" chip for system events), action as a Mono
code tag tinted by its meaning (neutral, warning, error), resource, origin IP in Mono, result as a
coloured word, and an expand chevron. An expanded row shows the raw event on the alternate surface
in Mono: event id, `before` and `after` values, reason and user agent.

## Mobile versions

- **Home**: greeting, search field with a launcher icon button beside it, eyebrow, and a 2-column
  card grid. The status tag shrinks to its dot only; the word moves into the screen reader label.
  Counts show as a small amber chip.
- **Tool menu**: a bottom sheet with grab handle, title and close, the client switcher as a
  full-width select, one row per tool (monogram, name, status line, external-link icon), then admin
  and sign out.
- **Account**: a profile card (avatar, name, email, role tag), grouped list rows with chevrons and
  optional status tags, the appearance choice as three radio buttons, and sign out as a full-width
  soft-red button.
- **Admin list**: a back chevron with title and count, a search field, filter chips with counts,
  and one card per row (avatar, name, meta line, tags) at 84–96 px. The primary action becomes a
  floating pill button at bottom right, above the bottom navigation.
