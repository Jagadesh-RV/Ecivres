import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Search, Star, ShieldCheck, Clock } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="pt-24 lg:pt-32 pb-16 px-4 bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
            Premium Services, <br className="hidden md:block" />
            <span className="text-primary">Delivered to You.</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            EcivreS connects you with top-rated professionals for all your needs. Book trusted services instantly, with transparent pricing.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                Find a Service <Search className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=provider">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                Become a Provider
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Categories Preview */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Popular Categories</h2>
          <p className="text-muted-foreground">Explore our most requested service categories.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Home Cleaning", "Plumbing", "Electrical", "Landscaping", "Personal Training", "Tutoring", "Photography", "Event Planning"].map((cat) => (
            <div key={cat} className="group cursor-pointer rounded-2xl border bg-card p-6 text-center hover:border-primary hover:shadow-md transition-all">
              <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Why EcivreS */}
      <section className="bg-muted/30 py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose EcivreS</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We hold our platform to the highest standards so you can book with confidence.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Verified Professionals</h3>
              <p className="text-muted-foreground">Every provider goes through a rigorous vetting process to ensure quality and safety.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Instant Booking</h3>
              <p className="text-muted-foreground">See real-time availability and book your service instantly without endless back-and-forth.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Satisfaction Guarantee</h3>
              <p className="text-muted-foreground">We stand behind every booking. If you're not satisfied, we'll make it right.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 max-w-4xl text-center space-y-8">
        <h2 className="text-4xl font-bold tracking-tight">Ready to get started?</h2>
        <p className="text-xl text-muted-foreground">Join thousands of satisfied customers and top-tier professionals on EcivreS today.</p>
        <Link href="/register">
          <Button size="lg" className="mt-4 px-12 text-lg">
            Create an Account <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>
    </div>
  );
}
