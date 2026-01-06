import React from "react";
import Layout from "../../components/Layout";
import TemplateCreate from "./TemplateCreate";

export default function Templates () {
    // If no templates, then show create

    // else show list of tempalates
    return <Layout><TemplateCreate /></Layout>
}