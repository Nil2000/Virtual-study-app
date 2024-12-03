import React from "react";
import FeedbackForm from "./_components/feedback-form";
import FeedbackList from "./_components/feedback-list";

export default function page() {
	return (
		<div className="font-sans grid gap-8 md:grid-cols-2 container mx-auto px-4">
			<FeedbackForm />
			<FeedbackList />
		</div>
	);
}
