export function NewsHero({title,subtitle}:{title:string;subtitle:string}) {
 return <section className="sb-container py-16"><p className="sb-kicker mb-5">SB-MECHKEY / THE JOURNAL</p><h1 className="mb-5 text-4xl font-extrabold tracking-tight md:text-6xl">{title}</h1><p className="max-w-2xl text-muted-foreground">{subtitle}</p></section>;
}
export default NewsHero;
