import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

export default function SimpleInput() {
	return (
		<div className="space-y-2">
			<Label htmlFor="input-01">Simple input</Label>
			<Input id="input-01" placeholder="Email" type="email" />
		</div>
	);
}
