interface Workflow {
	id: string;
	title: string;
	shortDescription: string;
	iconPath: string;
	savingsPercent: number;
	details: string[];
	exampleInput: string;
	exampleOutput: string;
	timeBefore: string;
	timeAfter: string;
}

interface Playbook {
	area: string;
	icon: string;
	description: string;
}

interface FaqItem {
	question: string;
	answer: string;
}
