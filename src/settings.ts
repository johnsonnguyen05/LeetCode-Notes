import {App, PluginSettingTab, Setting} from "obsidian";
import LeetCodeNotes from "./main";

export interface LeetCodeNotesSettings {
	username: string;
	csrfToken: string;
	leetcodeSession: string;
}

export const DEFAULT_SETTINGS: LeetCodeNotesSettings = {
	username: '',
	csrfToken: '',
	leetcodeSession: ''
}

export class LeetCodeNotesSettingTab extends PluginSettingTab {
	plugin: LeetCodeNotes;

	constructor(app: App, plugin: LeetCodeNotes) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Leetcode username')
			.setDesc('Used for fetching recent submissions')
			.addText(text => text
				.setPlaceholder('Leetcode username')
				.setValue(this.plugin.settings.username)
				.onChange(async (value) => {
					this.plugin.settings.username = value.trim();
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Csrftoken cookie')
			.setDesc('Value of csrftoken from leetcode.com (kept local)')
			.addText(text => text
				.setPlaceholder('Csrftoken')
				.setValue(this.plugin.settings.csrfToken)
				.onChange(async (value) => {
					this.plugin.settings.csrfToken = value.trim();
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Leetcode_session cookie')
			.setDesc('Value of leetcode_session from leetcode.com (kept local)')
			.addText(text => text
				.setPlaceholder('LEETCODE_SESSION')
				.setValue(this.plugin.settings.leetcodeSession)
				.onChange(async (value) => {
					this.plugin.settings.leetcodeSession = value.trim();
					await this.plugin.saveSettings();
				}));
	}
}
