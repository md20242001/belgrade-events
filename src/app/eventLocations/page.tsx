import { Suspense } from "react";
import VanuesForm from "@/components/EventLocationsForm";

export default function VanuesPage() {
    return (
        <Suspense fallback={<div>Učitavanje...</div>}>
            <VanuesForm />
        </Suspense>
    );
}