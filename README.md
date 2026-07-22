# Spark Match Spatial UX v2 | HLC / AJLC Sales Village

Room-native version of Spark Match for a wall-mounted iframe inside the Sales Village.

Success criterion: someone entering the virtual room should understand what the app is for and feel invited to start a match within 5 seconds.

Open with `?v=spatial2` after uploading to GitHub Pages.

Admin/coach view can be opened with `?admin=true`.

Supabase setup file included: `supabase_spark_match_sales_setup_text_array.sql`.


## v2.1 Meetings + Demo Seed

Added:
- `Meet now` opens a scheduling modal instead of sending a blind invite.
- Users can suggest 1-3 meeting times.
- Invites include the room location: `Inside this room · Spark Match table`.
- Hidden demo mode: open the app with `?v=spatial21&demo=true` to show a `Create demo profiles` button.
- Demo profiles are inserted into Supabase using stable demo user keys, so they can be updated without creating duplicates.

Recommended room URL:
`https://nivhorovitz.github.io/matchapp/?v=spatial21`

Demo/testing URL:
`https://nivhorovitz.github.io/matchapp/?v=spatial21&demo=true`

## v2.2 fixed demo + meetings

Visible checks:
- A small `v2.2` chip appears near the connection status.
- Open with `?demo=true` to show `Create demo profiles`.
- Match cards open a scheduling modal with meeting place: `Inside this room · Spark Match table`.

## v2.3

Fixes:
- Demo button now appears in the top bar when URL includes `?demo=true`.
- Version marker now reads `v2.3`.
- Scheduling modal is still opened from match cards after `Show my matches`, not from the question screen.

Test URL:
`https://nivhorovitz.github.io/matchapp/?demo=true`
