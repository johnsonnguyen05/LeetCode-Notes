export default function markdownFormat(difficulty: string, content: string, topics: string, submission: string, lang: string) {
    // python3 -> python for Prism syntax
    const langName = lang === 'python3' ? 'python' : lang;

    const md = 
`---
Tags:
- ${difficulty}
Topics:
${topics}
---
# Question
${content}

---

# Submission

\`\`\`${langName}
${submission}
\`\`\`

## Intuition 
%% Describe your first thoughts on how to solve this problem %%

## Approach
%% Describe your approach to solving the problem %%

## Complexity
%% Describe your time and space complexities of the submission %%
`
    return md
};