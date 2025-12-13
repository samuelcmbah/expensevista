
import React from 'react';

const TermsOfService : React.FC = () => {
  return (
    // Optional: Add a layout container if you have one for consistent padding/margins
    <div className="container mx-auto px-4 py-8">
      <div className="prose lg:prose-xl"> {/* Using prose for nice text formatting if you have Tailwind Typography */}
        <h1>Terms of Service for ExpenseVista</h1>

        <p><strong>Last Updated:</strong> December 13, 2025</p>

        <h3>This is a Portfolio Project</h3>
        <p>
          ExpenseVista is a demonstration application created by <strong>Samuel Mbah</strong>
          for portfolio purposes. Thank you for taking the time to review it.
        </p>

        <h3>1. Purpose of the Application</h3>
        <p>
          This Service is intended for demonstration and personal, non-commercial use only.
          While functional, it should not be considered a production-ready financial
          application.
        </p>

        <h3>2. No Warranty</h3>
        <p>
          The Service is provided "AS IS," without warranty of any kind. We make no
          guarantees regarding its reliability, accuracy, or availability. Please do not
          rely on it for managing critical financial data.
        </p>

        <h3>3. Your Responsibility</h3>
        <p>
          You are responsible for the data you input into the Service. We are not liable
          for any data loss or inaccuracies.
        </p>

        <h3>4. Contact</h3>
        <p>
          If you have any questions about these terms, please contact me at:
          <strong>samuelcmbah@gmail.com</strong>.
        </p>
      </div>
    </div>
  );
};

export default TermsOfService ;