# Copilot Instructions

## Code Block Languages

**Critical Rule:** Never use ```vue code blocks. Use ```ts instead.

- ```vue is not a recognized language and doesn't provide proper syntax highlighting
- Vue templates in code examples should use ```ts for TypeScript syntax
- Keep consistent language tags across all documentation

## Blockquote Callouts for Important Notes

**Critical Rule:** Use blockquotes with emojis for critical, important, or warning notes.

- Critical/warning notes: Use `⚠️` emoji
- Important notes: Use `💡` emoji
- Format: `> ⚠️ [TITLE]: [explanation]`
- Always place in blockquotes for emphasis
- Examples:
  - `> ⚠️ CRITICAL: Always provide a unique `:key` for efficient DOM updates.`
  - `> 💡 IMPORTANT: "Lazy" only means initial render; v-if IS fully reactive.`

## Quiz Management

**Critical Rule:** Every time you add questions to `quiz.md`, you MUST also update `quiz-answers.md` with the corresponding answers.

- Always update both files together in the same operation
- Maintain question numbering consistency between both files
- Provide detailed, accurate answers with code examples where applicable
