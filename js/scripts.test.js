// Unit tests for username validation logic in scripts.js

describe('Username validation regex', () => {
	// The regex from scripts.js
	const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

	test('valid username passes: contains uppercase, number, special char, 8+ chars', () => {
		expect(regex.test('Password1!')).toBe(true);
		expect(regex.test('A1@aaaaa')).toBe(true);
		expect(regex.test('Test123$')).toBe(true);
	});

	test('fails if less than 8 characters', () => {
		expect(regex.test('A1@aaaa')).toBe(false);
		expect(regex.test('A1@a')).toBe(false);
	});

	test('fails if missing uppercase letter', () => {
		expect(regex.test('password1!')).toBe(false);
		expect(regex.test('test123$')).toBe(false);
	});

	test('fails if missing number', () => {
		expect(regex.test('Password!')).toBe(false);
		expect(regex.test('TestTest$')).toBe(false);
	});

	test('fails if missing special character', () => {
		expect(regex.test('Password1')).toBe(false);
		expect(regex.test('Test1234')).toBe(false);
	});

	test('fails if contains invalid characters', () => {
		expect(regex.test('Password1! ')).toBe(false); // space not allowed
		expect(regex.test('Password1!#')).toBe(false); // # not in allowed special chars
	});
});

describe('Username input border color logic', () => {
	// Simulate the event handler logic
	function setBorderColor(input) {
		const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
		if (regex.test(input.value)) {
			input.style.borderColor = "green";
		} else {
			input.style.borderColor = "red";
		}
	}

	test('sets border to green for valid username', () => {
		const input = { value: 'Password1!', style: {} };
		setBorderColor(input);
		expect(input.style.borderColor).toBe('green');
	});

	test('sets border to red for invalid username', () => {
		const input = { value: 'password', style: {} };
		setBorderColor(input);
		expect(input.style.borderColor).toBe('red');
	});
});