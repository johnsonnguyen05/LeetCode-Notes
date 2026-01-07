import { Editor, MarkdownView, Notice, Plugin, htmlToMarkdown } from 'obsidian';
import { DEFAULT_SETTINGS, LeetCodeNotesSettings, LeetCodeNotesSettingTab} from "./settings";
import { getRecentSubmissionDetails } from 'leetcode-api/leetcode';
import { LeetCodeAuthTokens } from 'leetcode-api/types';
import markdownFormat from 'lib/md-format';

export default class LeetCodeNotes extends Plugin {
	settings: LeetCodeNotesSettings;
	
	private getAuth(): LeetCodeAuthTokens {
		// Check if required settings are initialized
		if (!this.settings.username || !this.settings.csrfToken || !this.settings.leetcodeSession) {
			new Notice('Please configure your leetcode credentials in the plugin settings');
		}

		return {
			username: this.settings.username,
			csrfToken: this.settings.csrfToken,
			leetcodeSession: this.settings.leetcodeSession
		}
	}

	async onload() {
		await this.loadSettings();

		// This adds a command so the user can retrieve their latest *accepted* submission from LC 
		this.addCommand({
			id: 'insert-recent-submission',
			name: 'Insert recent submission',
			callback: async () => {
				try {
					const recentSubmissionDetails = await getRecentSubmissionDetails(this.getAuth());
					if (!recentSubmissionDetails) {
						console.error("No recent submission details found");
						new Notice("No recent submission details found");
						return 
					}		
					const difficulty: string = recentSubmissionDetails.submissionDetails.question.difficulty
					const content: string = htmlToMarkdown(recentSubmissionDetails.submissionDetails.question.content);
					const recentSubmission: string = recentSubmissionDetails.submissionDetails.code;
					const recentSubmissionLang: string = recentSubmissionDetails.submissionDetails.lang.name;
					// const date = new Date(data.submissionDetails.timestamp * 1000);
					const recentTopics: string[] = recentSubmissionDetails.submissionDetails.question.topicTags.map(tag => tag.name);
					const topics: string = recentTopics
						.map(t => `  - "[[${t}]]"`)
						.join("\n");

					const md = markdownFormat(difficulty, content, topics, recentSubmission, recentSubmissionLang)
					const fileName = `${recentSubmissionDetails.submissionDetails.question.questionFrontendId}. ${recentSubmissionDetails.submissionDetails.question.title}.md`;
					const fileExists = this.app.vault.getAbstractFileByPath(fileName) !== null;
					if (fileExists) {
						new Notice(`File "${fileName}" already exists in your vault`);
						return;
					}
					await this.app.vault.create(fileName, md);
					new Notice(`Successfully retrieved latest submission`);
				} catch (err) {
					new Notice("Failed to fetch code");
					console.error("Failed to fetch code: ", err);
				}
			}
		})

		this.addCommand({
			id: 'insert-recent-question',
			name: 'Insert recent question',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				try {
					const recentSubmissionDetails = await getRecentSubmissionDetails(this.getAuth());
					if (!recentSubmissionDetails) {
						console.error("No recent submission details found");
						return 
					}	
					const recentQuestion = htmlToMarkdown(recentSubmissionDetails.submissionDetails.question.content);

					editor.replaceSelection(recentQuestion);
				} catch (err) {
					console.error("Cannot insert recent question", err);
				}
			}
		});

		this.addCommand({
			id: 'insert-recent-code',
			name: 'Insert recent code',
			editorCallback: async (editor: Editor, view: MarkdownView) => {
				try {
					const recentSubmissionDetails = await getRecentSubmissionDetails(this.getAuth());
					if (!recentSubmissionDetails) {
						console.error("No recent submission details found");
						return 
					}	
					const recentSubmission = recentSubmissionDetails.submissionDetails.code;

					editor.replaceSelection(recentSubmission);
				} catch (err) {
					console.error("Cannot insert recent question", err);
				}
			}
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new LeetCodeNotesSettingTab(this.app, this));

	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<LeetCodeNotesSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}