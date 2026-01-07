interface RecentAcSubmissions {
    id: string;
    title: string;
    titleSlug: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
}

export interface LeetCodeRecentAcSubmissionResponse {
    data: {
        recentAcSubmissionList: RecentAcSubmissions[];
    };
}

interface submissionDetails {
    runtimeDisplay: string;
    memoryDisplay: string;
    code: string;
    timestamp: number;
    lang: {
        name: string;
    }
    question: {
        difficulty: string;
        questionFrontendId: string;
        title: string;
        titleSlug: string;
        content: string;
        topicTags: { name: string }[];
    }
}

export interface LeetCodeSubmissionDetails {
    data: {
        submissionDetails: submissionDetails;
    }
}

export interface LeetCodeAuthTokens {
    username: string;
    csrfToken: string;
    leetcodeSession: string;
}