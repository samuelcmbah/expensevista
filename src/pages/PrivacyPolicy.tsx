
import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    // Optional: Add a layout container if you have one for consistent padding/margins
    <div className="container mx-auto px-4 py-8"> 
      <div className="prose lg:prose-xl"> {/* Using prose for nice text formatting if you have Tailwind Typography */}
        <h1>Privacy Notice for ExpenseVista</h1>
        <p><strong>Last Updated:</strong> December 13, 2025</p>

        <h3>This is a Portfolio Project</h3>
        <p>
          Thank you for checking out ExpenseVista! This application was built by 
          <strong>Samuel Mbah</strong> as a personal portfolio project to demonstrate 
          web development skills.
        </p>

        <h3>What Data is Collected?</h3>
        <ul>
          <li>
            <strong>From Google Sign-In:</strong> Your name and email address are used to 
            create and identify your account.
          </li>
          <li>
            <strong>Data You Enter:</strong> Any financial transactions or budget 
            information you add to the application.
          </li>
        </ul>

        <h3>Why is this Data Collected?</h3>
        <p>
          This data is collected solely to provide the core functionality of the 
          application—allowing you to log in and track your expenses.
        </p>

        <h3>Data Sharing</h3>
        <p>
          Your data is not and will never be sold or shared with any third parties. It is 
          only used for the purpose of this demonstration application.
        </p>

        <h3>Contact</h3>
        <p>
          If you have any questions, you can contact me at: 
          <strong>samuelcmbah@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;