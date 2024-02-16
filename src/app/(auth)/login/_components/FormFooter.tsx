"use Client";
import Link from "next/link";
import { MouseEventHandler } from "react";

const FormFooter = ({
  formType,
  action,
}: {
  formType: Boolean;
  action: MouseEventHandler<HTMLParagraphElement>;
}) => {
  return (
    <div className="text-sm text-center mt-5  text-opacity-30 ">
      {formType ? "Already have an account?" : "New on our platform?"}

      <span
        onClick={action}
        className="text-sm ml-1 opacity-100 text-blue-600 cursor-pointer"
      >
        {formType ? (
          <Link href="/sign-up">Create an account</Link>
        ) : (
          <Link href="/login">Login</Link>
        )}
      </span>
    </div>
  );
};

export default FormFooter;
