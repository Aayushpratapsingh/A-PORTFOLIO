import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

export interface ProjectShowcaseCardProps {
  title: string;
  category?: string;
  description: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  tags: string[];
  year?: string;
  link?: string;
  linkLabel: string;
  icon?: ReactNode;
  featured?: boolean;
  sizes: string;
  projectCategory?: string;
}

export default function ProjectShowcaseCard({
  title,
  category,
  description,
  image,
  imageWidth,
  imageHeight,
  tags,
  year,
  link,
  linkLabel,
  icon,
  featured = false,
  sizes,
  projectCategory,
}: ProjectShowcaseCardProps) {
  const actionableLink = link && link !== "#" ? link : undefined;

  return (
    <article data-reveal data-project-category={projectCategory} className={`project-card${featured ? " project-card--featured" : ""}`}>
      <div className="project-card__media">
        <Image
          src={image}
          alt={`${title} project preview`}
          width={imageWidth}
          height={imageHeight}
          sizes={sizes}
          loading="lazy"
          className="project-card__image"
        />
        <div className="project-card__image-wash" aria-hidden="true" />
        <div className="project-card__badges">
          {category && <span className="project-card__badge">{category}</span>}
          {year && <span className="project-card__badge project-card__badge--quiet">{year}</span>}
        </div>
        {actionableLink && (
          <a
            className="project-card__preview-link"
            href={actionableLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${linkLabel}: ${title}`}
          >
            <span>{linkLabel}</span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        )}
      </div>

      <div className="project-card__body">
        <div className="project-card__heading">
          <div>
            {category && <p className="project-card__eyebrow">{category}</p>}
            <h3>{title}</h3>
          </div>
          {icon && <span className="project-card__icon" aria-hidden="true">{icon}</span>}
        </div>
        <p className="project-card__description">{description}</p>
        <ul className="project-card__tags" aria-label={`${title} project tags`}>
          {tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
      </div>
    </article>
  );
}
