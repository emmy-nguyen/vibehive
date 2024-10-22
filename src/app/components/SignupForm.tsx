import * as Form from "@radix-ui/react-form";
import Link from "next/link";

const SignupForm = () => {
  return (
    <div className="flex items-center justify-center">
      <Form.Root className="w-full max-w-md bg-neutral-900 p-8 rounded-lg shadow-lg">
        {/* Email field */}
        <Form.Field className="mb-6" name="email">
          <div className="mb-2">
            <Form.Label className="block text-white">Email</Form.Label>
            <Form.Message className="text-red-400 text-sm" match="valueMissing">
              Please enter your email
            </Form.Message>
            <Form.Message className="text-red-400 text-sm" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="email"
              required
              className="w-full p-3 rounded-md border border-gray-300 forcus-outline-none forcus:ring-2 focus:ring-[#1DB954]"
              placeholder="Enter your email"
            ></input>
          </Form.Control>
        </Form.Field>

        {/* Password field */}
        <Form.Field name="password" className="mb-6">
          <div className="mb-2">
            <Form.Label className="block text-white">Password</Form.Label>
            <Form.Message match="valueMissing" className="text-red-400 text-sm">
              Please enter your password
            </Form.Message>
            <Form.Message match="typeMismatch" className="text-red-400 text-sm">
              Please provide a valid password
            </Form.Message>
          </div>
          <Form.Control asChild>
            <input
              type="password"
              required
              className="w-full p-3 rounded-md border border-gray-300 focus-outline-non focus:ring-2 focus-ring-[#1DB954]"
              placeholder="Enter your password"
            ></input>
          </Form.Control>
        </Form.Field>

        {/* submit button */}
        <Form.Submit asChild>
          <button className="w-full bg-white text-black py-3 rounded-md hover:bg-yellow-300 transition">
            Sign up
          </button>
        </Form.Submit>
      </Form.Root>
    </div>
  );
};

export default SignupForm;
