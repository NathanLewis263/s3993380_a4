import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { Text, Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Listing } from ".";

interface Booking {
    _id: string;
    listingId: string;
    startDate: string;
    checkOutDate: string;
    client: {
        name: string;
        email: string;
        mobileNo: string;
        postal: string;
        residential: string;
    }
}

const Confirmation = () => {
    const router = useRouter();
    const bookingId = router.query.bookingId;
    const bookingName = router.query.bookingName;
    const [booking, setBooking] = useState<Booking | null>(null);
    const [listing, setListing] = useState<Listing | null>(null);
    const [price, setPrice] = useState<number | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/bookings/${bookingId}`);
                setBooking(response.data);
                console.log('Booking data:', response.data);
            } catch (error) {
                console.error('Error fetching booking:', error);
            }
        }
        if (bookingId) {
            fetchBooking();
        }
    }, [bookingId]);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                if (booking?.listingId) {
                    console.log('Fetching listing for ID:', booking.listingId);
                    const response = await axios.get(`http://localhost:3001/api/listings/${booking.listingId}`);
                    setListing(response.data);
                    console.log('Listing data:', response.data);
                }
            } catch (error) {
                console.error('Error fetching listing:', error);
            }
        }
        fetchListing();
    }, [booking]);

    // reference:
    // https://stackoverflow.com/questions/3224834/get-difference-between-2-dates-in-javascript
    useEffect(() => {
        if (booking?.startDate && booking?.checkOutDate && listing?.price) {
            const startDate = new Date(booking.startDate);
            const checkOutDate = new Date(booking.checkOutDate);
            const diffTime = Math.abs(checkOutDate.getTime() - startDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            setPrice(listing.price * diffDays);
            setDuration(diffDays);
        }
    }, [booking, listing]);

    return (
        <Layout centerMain={false}>
            <div className="flex flex-col items-center justify-center gap-4 w-1/2 mx-auto mt-10 shadow-lg p-4 rounded-xl">
                <Text fontSize="2xl" fontWeight="bold">Booking Confirmed!</Text>
                <Text fontSize="2xl">Your booking for {listing?.name} has been confirmed.</Text>
                <div className="flex flex-col gap-3 justify-center items-center w-full pt-4">
                <Text fontWeight="bold">Booking ID: <span className="font-normal">{bookingId}</span></Text>
                <Text fontWeight="bold">Check-in Date: <span className="font-normal">{booking?.startDate.split('T')[0]}</span></Text>
                <Text fontWeight="bold">Check-out Date: <span className="font-normal">{booking?.checkOutDate.split('T')[0]}</span></Text>
                <Text fontWeight="bold">Duration: <span className="font-normal">{duration} {duration === 1 ? "day" : "days"}</span></Text>
                <Text fontWeight="bold">Booking Status: <span className="font-normal">Confirmed</span></Text>
                <Text fontWeight="bold">Booking Amount: <span className="font-normal">${price}</span></Text>
                <Text fontWeight="bold">Booking Payment Status: <span className="font-normal">Paid</span></Text>
                <Button onClick={() => router.push('/')} colorScheme="blue" borderRadius="full" size="lg" width="full" className="w-full">Back to Home</Button>
                </div> 
            </div>
        </Layout>
    );
};

export default Confirmation;