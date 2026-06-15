import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export default function TrainingPlacementPage() {
    return (
        <>
            <Navigation />

            <main className="pt-32 pb-24">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <h1 className="font-display font-bold text-5xl text-primary mb-6">
                        Training & Placement
                    </h1>

                    <p className="text-lg text-slate-600 max-w-3xl">
                        Industry-focused training programs and placement assistance
                        designed to help students build practical skills and secure
                        career opportunities.
                    </p>
                </div>
            </main>

            <Footer />
        </>
    );
}