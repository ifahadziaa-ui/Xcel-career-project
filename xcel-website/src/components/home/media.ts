/* =====================================================================
   Approved homepage photographs, in one place. A job id with no entry keeps its placeholder.

   Approved here: only images that show no people, no logos and no place or client, so they imply no
   staff, facility or customer relationship (an analytics dashboard, server racks). Both are Unsplash
   photographs (Unsplash License: free commercial use, no attribution required), taken from
   landing-prototype-clean/assets/img/ (spec-analytics.webp, spec-cyber.webp).

   Withheld (see docs/MEDIA.md): the stock photographs of identifiable people (long-term care, nurse care,
   IT colleagues, and the two showreel portraits). No per-photo source or model-release record exists,
   the client asked for real staff and no stock look (Q23, Q25), and healthcare photographs could read as
   a care track record. To approve one later, copy it to public/media/jobs/ and add an entry here.

   Decorative: the card's text already says what the role is, so alt is empty. Server-safe data.
   ===================================================================== */
export interface MediaImage {
  src: string;
  /** CSS object-position, from the prototype's JOB_IMG */
  position: string;
  alt: string;
}

export const JOB_PHOTOS: Record<string, MediaImage> = {
  "revenue-cycle": { src: "/media/jobs/spec-analytics.webp", position: "40% 50%", alt: "" },
  "cyber-engineer": { src: "/media/jobs/spec-cyber.webp", position: "50% 50%", alt: "" },
};
