import React from "react";
import "./NewsletterCard.css";

export default function NewsletterCard({ article }) {
  return (
    <div className="newsletter-card">
      <div className="card-thumbnail">
        <img src={article.thumbnail} alt={article.title} />
        {article.part && <span className="badge part-badge">{article.part}</span>}
        {article.tag && !article.part && <span className="badge tag-badge">{article.tag}</span>}
      </div>
      <div className="card-content">
        <h4 className="card-title">{article.title}</h4>
        {article.subtitle && <p className="card-subtitle">{article.subtitle}</p>}
        <span className="card-time">{article.time}</span>
      </div>
    </div>
  );
}