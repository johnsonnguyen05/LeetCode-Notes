import { requestUrl } from "obsidian";
import { LeetCodeRecentAcSubmissionResponse, LeetCodeSubmissionDetails, LeetCodeAuthTokens } from "./types";

// returns submission id
export async function getRecentAcSubmissions(username: string, limit = 1) {
    const query = `
        query recentAcSubmissions($username: String!, $limit: Int!) {
            recentAcSubmissionList(username: $username, limit: $limit) {
                id
                title
                titleSlug
                timestamp
                statusDisplay
                lang
            }
        }
    `;
    
    try {
        const response = await requestUrl({
            url: 'https://leetcode.com/graphql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com'
            },
            body: JSON.stringify({
                query: query,
                variables: { username, limit }
            })
        });
        
        const jsonResponse = response.json as LeetCodeRecentAcSubmissionResponse;
        return jsonResponse.data;
    } catch (error) {
        console.error('Error fetching LeetCode user:', error);
        throw error;
    }
}

export async function getSubmissionDetails(submissionId: number, auth?: LeetCodeAuthTokens) {
    const query = `
        query submissionDetails($submissionId: Int!) {
            submissionDetails(submissionId: $submissionId) {
                runtimeDisplay
                memoryDisplay
                code
                timestamp
                lang {
                    name
                }
                question {
                    difficulty
                    questionFrontendId
                    title
                    titleSlug
                    content
                    topicTags {
                        name
                    }
                }
            }
        }
    `;

    try {
        if (!auth?.csrfToken || !auth?.leetcodeSession) {
            throw new Error('Missing LeetCode auth tokens (csrftoken or LEETCODE_SESSION)');
        }

        const response = await requestUrl({
            url: 'https://leetcode.com/graphql',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Referer': 'https://leetcode.com',
                'x-csrftoken': auth.csrfToken,
                'Cookie': `LEETCODE_SESSION=${auth.leetcodeSession}; csrftoken=${auth.csrfToken}`
            },
            body: JSON.stringify({
                query: query,
                variables: { submissionId }
            })
        });
        
        const jsonResponse = response.json as LeetCodeSubmissionDetails;
        return jsonResponse.data;
    } catch (err) {
        console.error("Failed to fetch submission details: ", err);
        throw err;
    }
}

export async function getRecentSubmissionDetails(auth: LeetCodeAuthTokens) {
    try {
        const recentAcSubmission = await getRecentAcSubmissions(auth.username);
        if (!recentAcSubmission) {
            console.error("No user found")
            return
        }

        const questionId = recentAcSubmission.recentAcSubmissionList[0]?.id;
        if (!questionId) {
            console.error("No recent accepted submssion found")
            return
        } 

        const recentSubmissionDetails = await getSubmissionDetails(parseInt(questionId), auth);
        return recentSubmissionDetails;
    } catch (err) {
        console.error(err)
        throw err
    }
}