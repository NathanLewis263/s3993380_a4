import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, FormControl, FormLabel, Input, Select, TableContainer, Thead, Th, Tr, Table, Tbody, Td, Spinner, Link, Text } from "@chakra-ui/react";
import Layout from "@/components/layout";
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'

// Listing
export interface Listing {
  _id: number;
  name: string;
  summary: string;
  price: number;
  review_scores: {
    review_scores_rating: number;
  };
}

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState<number | null>(null);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [bedroomsOptions, setBedroomsOptions] = useState<number[]>([]);
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const [listingsFound, setListingsFound] = useState<number | null>(null);

  // use effect to fetch property types
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/listing/property-types");
        setPropertyTypes(response.data);
      } catch (error) {
        console.error("Error fetching property types:", error);
      }
    };
    fetchPropertyTypes();
  }, []);

  // use effect to fetch bedrooms
  useEffect(() => {
    const fetchBedrooms = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/listing/bedrooms");
        setBedroomsOptions(response.data);
      } catch (error) {
        setError("Error fetching bedrooms");
        console.error("Error fetching bedrooms:", error);
      }
    };
    fetchBedrooms();
  }, []);

  // use effect to fetch listings on initial render
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3001/api/listings");
        setListings(response.data);
        console.log(response.data);
      } catch (error) {
        setError("Error fetching listings");
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // function to handle search
  const handleSearch = async () => {
    if (!location) {
      setError("Please enter a location");
      return;
    }
    try {
      setLoading(true);
      console.log(location, propertyType, bedrooms);
      const response = await axios.post("http://localhost:3001/api/listings/filter", {
        location: location,
        propertyType: propertyType,
        bedrooms: bedrooms
      });
      setListings(response.data);
      setListingsFound(response.data.length);
      console.log(response.data.length);
    } catch (error) {
      setError("Error fetching filtered listings");
      console.error("Error fetching filtered listings:", error);
    } finally {
      setLoading(false);
      setError("");
    }
  };

  // Memoize the table
  const tableCards = useMemo(() => {
    return listings.map((listing) => (
      <Card key={listing._id} width={"100%"} height={"100%"}>
        <CardHeader>
          <Link href={`/booking?listing_id=${listing._id}`} color={"blue"} fontWeight={"bold"} fontSize={"30px"}>{listing.name}</Link>
        </CardHeader>
        <CardBody className="flex flex-col gap-2">
          <Text fontSize={"16px"} fontWeight={"bold"}>Summary: <span className="font-normal">{listing.summary}</span></Text>
          <Text fontSize={"16px"} fontWeight={"bold"}>Daily Rate: <span className="font-normal">${listing.price}</span></Text>
          <Text fontSize={"16px"} fontWeight={"bold"}>Rating: <span className="font-normal">{listing.review_scores.review_scores_rating || "N/A"}</span></Text>
        </CardBody>
      </Card>
    ));
  }, [listings]);

  return (
    <Layout centerMain={false}>
        <div className="flex flex-row items-left gap-4 mt-10 ml-5 mr-5">
          <FormControl>
            <FormLabel>Location</FormLabel>
            <Input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          </FormControl>
          <FormControl>
            <FormLabel>Property Type</FormLabel>
            <Select onChange={(e) => setPropertyType(e.target.value)}>
              <option key="all" value="">All property types</option>
              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Number of bedrooms</FormLabel>
            <Select onChange={(e) => setBedrooms(e.target.value === "any" ? null : Number(e.target.value))}>
              <option key="any" value="any" >Any number of bedrooms</option>
              {bedroomsOptions.map((option) => (
                <option key={option} value={option}>
                  {option} bedrooms
                </option>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-row items-center justify-center mt-4 ml-10 mr-10">
          <Button width={"100%"} height={"50px"} borderRadius={"20px"} backgroundColor={"black"} color={"white"} _hover={{color: "grey"}} onClick={handleSearch} isLoading={loading} isDisabled={loading} loadingText="Searching...">Search</Button>
        </div>  
        {error && (
          <div className="flex justify-center items-center h-full mt-15">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        {loading ? (
            <div className="flex justify-center items-center h-full mt-15">
              <Spinner size="xl" />
            </div>
          ) : (
          <div className="mt-10 ml-10 mr-10">
              {listingsFound !== null && <Text fontSize={"20px"} fontWeight={"bold"} className="flex justify-center">{listingsFound} listings found that match your preferences</Text>}
              <div className="flex flex-row flex-wrap gap-4 mt-10 mb-10">
                {tableCards}
              </div>
          </div>
        )}
    </Layout>
  );
}