# Live chat API contract

All JSON, same origin. Visitors are identified by a per-conversation `token` (random string)
that the widget keeps in localStorage together with the `conversationId`.

## Public

### POST /api/chat/start
Body: `{ name: string (2..80), email: string, message?: string (<=2000), page?: string }`
Response 201: `{ conversationId: number, token: string, messages: Message[] }`
The server adds a bot greeting message immediately (sender "bot"). If `message` is given it is stored
as the first visitor message and may trigger a bot auto-answer.

### POST /api/chat/:id/messages
Body: `{ token: string, body: string (1..2000) }`
Response 201: `{ messages: Message[] }` (only messages created by this call: the visitor message plus any bot auto-answer)

### GET /api/chat/:id/messages?token=…&after=<messageId>
Response 200: `{ status: 'open'|'closed', messages: Message[] }` — messages with id > `after` (all when omitted).
Poll this every ~4 s while the widget is open.

### Message
```
{ id: number, sender: 'visitor'|'owner'|'bot', body: string, createdAt: string }
```

## Admin (cookie session, same as other /api/admin routes)

- GET /api/admin/conversations?status=open|closed|all&page=&pageSize= → `{ items: Conversation[], total, page, pageSize, unread: number }`
- GET /api/admin/conversations/unread → `{ unread: number }` (conversations with unread visitor messages)
- GET /api/admin/conversations/:id → `{ conversation: Conversation, messages: Message[] }` (marks visitor messages as read)
- POST /api/admin/conversations/:id/reply `{ body }` → `{ message: Message }` (emails the visitor if SMTP is configured)
- PATCH /api/admin/conversations/:id `{ status: 'open'|'closed' }` → `{ conversation }`
- DELETE /api/admin/conversations/:id → `{ ok: true }`

### Conversation
```
{ id, name, email, status: 'open'|'closed', page: string|null, unreadForOwner: number,
  lastMessageAt: string, lastMessagePreview: string, createdAt: string }
```

Owner notification: on every new visitor message the owner is emailed (when SMTP is configured) with the
text and a link to `/backoffice/conversations/:id`. Without SMTP the back office still shows an unread badge.
