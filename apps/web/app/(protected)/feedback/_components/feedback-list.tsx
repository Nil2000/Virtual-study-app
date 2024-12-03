import React from "react";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { ThumbsUp } from "lucide-react";

const mockFeedback = [
	{
		id: 1,
		type: "comment",
		content: "Great app! Love the user interface.",
		author: "John Doe",
		votes: 5,
	},
	{
		id: 2,
		type: "feature",
		content: "It would be awesome to have a dark mode.",
		author: "Jane Smith",
		votes: 10,
	},
	{
		id: 3,
		type: "comment",
		content: "The latest update improved performance significantly.",
		author: "Bob Johnson",
		votes: 3,
	},
];
export default function FeedbackList() {
	return (
		<div>
			<h1 className="text-2xl font-semibold mb-8">Recent Feedbacks</h1>
			<div className="space-y-4">
				{mockFeedback.map((item) => (
					<Card key={item.id}>
						<CardHeader>
							<CardTitle className="text-lg">
								{item.type === "feature" ? "💡 Feature Request" : "💬 Comment"}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="mb-2">{item.content}</p>
							<div className="flex justify-between items-center text-sm text-muted-foreground">
								<span>By {item.author}</span>
								<Button variant="outline" size="sm">
									<ThumbsUp className="mr-2 h-4 w-4" />
									{item.votes}
								</Button>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
