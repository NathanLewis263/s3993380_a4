import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Booking = () => {
    const router = useRouter();
    const listing_id = router.query.listing_id as string;

    useEffect(() => {
        if (listing_id) {
            console.log(listing_id);
        }
    }, [listing_id]);
  return (
    <Layout centerMain={false}>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-2xl font-bold">Booking {listing_id}</div>
      </div>
    </Layout>
  );
};

export default Booking;