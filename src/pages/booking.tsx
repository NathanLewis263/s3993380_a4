import Layout from "@/components/layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { Listing } from ".";
import { Text, Spinner, Button, FormControl, FormLabel, Input, Select, TableContainer, Thead, Th, Tr, Table, Tbody, Td, Link, Box, FormErrorMessage } from "@chakra-ui/react";

const Booking = () => {
    const router = useRouter();
    const listing_id = router.query.listing_id as string;
    const [listing, setListing] = useState<Listing | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [checkInDate, setCheckInDate] = useState<string>("");
    const [checkOutDate, setCheckOutDate] = useState<string>("");
    const [dateError, setDateError] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("");
    const [postal, setPostal] = useState("");
    const [residential, setResidential] = useState("");

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string) => {
        const phoneRegex = /^\d{10}$/;
        return phoneRegex.test(phone);
    };

    const handleSubmit = async () => {
        if (!checkInDate || !checkOutDate) {
            setError("Please select both check-in and check-out dates");
            return;
        }
        if (dateError != "") {
            setError("Please fill in all fields");
            return;
        }
        if (postal != "" && residential != "" && postal.toLowerCase() == residential.toLowerCase()) {
            setError("Postal and residential cannot be the same");
            return;
        }
        if (name == "" || email == "" || mobileNo == "") {
            setError("Please fill in all fields");
            return;
        }
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }
        if (!validatePhone(mobileNo)) {
            setError("Please enter a valid 10-digit phone number");
            return;
        }
        else {
            setError("");
            try {
                setLoading(true);
                console.log('Sending booking data:', {
                    listingId: listing_id,
                    startDate: checkInDate,
                    checkOutDate: checkOutDate,
                    name: name,
                    email: email,
                    mobileNo: mobileNo,
                    postal: postal,
                    residential: residential
                });
                const response = await axios.post("http://localhost:3001/api/booking", {
                    listingId: listing_id,
                    startDate: checkInDate,
                    checkOutDate: checkOutDate,
                    name: name,
                    email: email,
                    mobileNo: mobileNo,
                    postal: postal,
                    residential: residential
                });
                console.log(response.data);
                if (response.data.message === 'Booking created successfully') {
                    router.push(`/confirmation?bookingId=${response.data.bookingId}`);
                } else {
                    setError(response.data.message || "Error creating booking");
                }
            } catch (error: any) {
                console.error("Error creating booking:", error);
                setError(error.response?.data?.message || "Error creating booking");
            } finally {
                setLoading(false);
            }
        }
    }

    useEffect(() => {
        const fetchBookingDetails = async (id: string) => {
            setLoading(true);
            setError("");
            try {
                const response = await axios.get(`http://localhost:3001/api/listings/${id}`);
                setListing(response.data);
            } catch (error: any) {
                console.error("Error fetching booking details:", error);
                setError(error.response?.data?.message || "Error fetching booking details");
            } finally {
                setLoading(false);
            }
        }

        if (listing_id) {
            fetchBookingDetails(listing_id);
        }
    }, [listing_id]);

    const handleCheckInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckInDate(e.target.value);
        if (checkOutDate && new Date(e.target.value) > new Date(checkOutDate)) {
            setDateError("Check-out date cannot be before check-in date");
        } else {
            setDateError("");
        }
    };
    const handleCheckOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckOutDate(e.target.value);
        if (checkInDate && new Date(e.target.value) < new Date(checkInDate)) {
            setDateError("Check-out date cannot be before check-in date");
        } else {
            setDateError("");
        }
    };

    const handlePostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPostal(e.target.value);
        if (postal != "" && residential != "" && postal.toLowerCase() == residential.toLowerCase()) {
            setError("Postal and residential cannot be the same");
        } else {
            setError("");
        }
    };
    const handleResidentialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setResidential(e.target.value);
        if (postal != "" && residential != "" && postal.toLowerCase() == residential.toLowerCase()) {
            setError("Postal and residential cannot be the same");
        } else {
            setError("");
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPhone = e.target.value;
        setMobileNo(newPhone);
    };

    return (
        <Layout centerMain={false}>
            <div className="flex flex-col items-center justify-center">
                <div className="text-2xl font-bold mt-10">Booking for {listing?.name}</div>
                <FormControl className="mt-10 flex flex-col items-center" isDisabled={loading} isInvalid={!!dateError}>
                    <div className="w-1/2">
                        <p className="font-bold text-2xl">Booking Detail:</p>
                        <FormLabel textAlign="left" marginTop={4}>Check in:</FormLabel>
                        <Input
                            type="date"
                            value={checkInDate}
                            onChange={handleCheckInChange}
                            width="100%"
                            min={new Date().toISOString().split('T')[0]}
                            placeholder="Check in date"
                            opacity={!checkInDate ? 0.5 : 1}
                        />
                        <FormLabel marginTop={4} textAlign="left">Check out:</FormLabel>
                        <Input
                            type="date"
                            value={checkOutDate}
                            onChange={handleCheckOutChange}
                            width="100%"
                            min={checkInDate ? checkInDate : new Date().toISOString().split('T')[0]}
                            placeholder="Check out date"
                            opacity={!checkOutDate ? 0.5 : 1}
                        />
                    </div>
                    <FormErrorMessage>{dateError}</FormErrorMessage>
                </FormControl>

                <FormControl className="flex flex-col items-center mt-10 mb-10">
                    <div className="w-1/2">
                        <p className="mt-10 font-bold text-2xl">Your Details:</p>
                        <FormLabel textAlign="left" marginTop={4}>Name:</FormLabel>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            width="100%"
                            isRequired
                            placeholder="Name (required)"
                        />
                        <FormLabel textAlign="left" marginTop={4}>Email:</FormLabel>
                        <Input
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            width="100%"
                            isRequired
                            placeholder="Email (required)"
                        />
                        <FormLabel textAlign="left" marginTop={4}>Mobile No:</FormLabel>
                        <Input
                            type="tel"
                            value={mobileNo}
                            onChange={handlePhoneChange}
                            width="100%"
                            isRequired
                            placeholder="Mobile No (10 digits) (required)"
                        />
                        <FormLabel textAlign="left" marginTop={4}>Postal address:</FormLabel>
                        <Input
                            type="text"
                            value={postal}
                            onChange={handlePostalChange}
                            width="100%"
                            placeholder="Postal address"
                        />
                        <FormLabel textAlign="left" marginTop={4}>Residential address:</FormLabel>
                        <Input
                            type="text"
                            value={residential}
                            onChange={handleResidentialChange}
                            width="100%"
                            placeholder="Residential address (cannot be the same as postal)"
                        />
                        {error && <p className="text-red-500 mt-4">{error}</p>}
                        <Button marginTop={4} width="100%" backgroundColor={"black"} color={"white"} _hover={{ color: "grey" }} onClick={handleSubmit} isLoading={loading} isDisabled={loading} loadingText="Submitting...">Submit</Button>
                    </div>
                </FormControl>
            </div>
        </Layout>
    );
};

export default Booking;