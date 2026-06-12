"use client";

import Head from "next/head";

export default function Page() {
  return (
    <div style={{ padding: "20px" }}>
      <Head>
        <title>Sentry Onboarding</title>
        <meta name="description" content="Test Sentry setup" />
      </Head>

      <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
          Sentry Onboarding Complete
        </h1>
        <p style={{ marginBottom: "2rem" }}>
          Click the button below to throw an error and see it in your Sentry issues.
        </p>

        <button
          style={{ padding: "10px 20px", fontSize: "1.2rem", cursor: "pointer", backgroundColor: "#FACC15", color: "#000", border: "none", borderRadius: "5px" }}
          onClick={() => {
            throw new Error("Sentry Example Frontend Error");
          }}
        >
          Throw error
        </button>
      </main>
    </div>
  );
}
