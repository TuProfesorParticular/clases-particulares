import { getFeaturedReviews } from "@/lib/reviews";

export default async function Testimonials() {
  const reviews = await getFeaturedReviews();

  if (reviews.length === 0) return null;

  return (
    <section className="mt-16">
      <h2 className="text-center text-2xl font-bold text-stone-900 sm:text-3xl">
        Lo que dicen nuestros alumnos
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <figure
            key={review.id}
            className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
          >
            <span className="text-amber-400">
              {"★".repeat(review.rating)}
              <span className="text-stone-200">{"★".repeat(5 - review.rating)}</span>
            </span>
            <blockquote className="mt-3 text-sm text-stone-700">
              “{review.comment}”
            </blockquote>
            <figcaption className="mt-4 text-xs text-stone-500">
              {review.student.name} · clase con{" "}
              {review.teacherProfile.user.name}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
