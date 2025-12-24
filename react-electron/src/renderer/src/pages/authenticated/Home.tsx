import React from "react";
import { Link } from "react-router";
import Layout from "../../components/Layout";

export default function Home() {
  return (
    <Layout>
      <Link to="/questionnaire/create">Create</Link>
      <h1>Questionnaires</h1>
    </Layout>
  );
}
