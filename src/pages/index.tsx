import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Button, FormControl, FormLabel, Input, Select, TableContainer, Thead, Th, Tr, Table, Tbody, Td, Spinner, Link, Text } from "@chakra-ui/react";
import Layout from "@/components/layout";

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
  const tableRows = useMemo(() => {
    return listings.map((listing) => (
      <Tr key={listing._id}>
        <Td whiteSpace="normal" wordBreak="break-word">
            <Link href={`/booking?listing_id=${listing._id}`}  _hover={{color: "blue"}}>{listing.name}</Link>
          </Td>
        <Td whiteSpace="normal" wordBreak="break-word">{listing.summary}</Td>
        <Td>${listing.price}</Td>
        <Td>{listing.review_scores.review_scores_rating || "N/A"}</Td>
      </Tr>
    ));
  }, [listings]);

  // Memoize the property type options
  const propertyTypeOptions = useMemo(() => {
    return propertyTypes.map((type) => (
      <option key={type} value={type}>
        {type}
      </option>
    ));
  }, [propertyTypes]);

  // Memoize the bedroom options
  const bedroomOptions = useMemo(() => {
    return bedroomsOptions.map((option) => (
      <option key={option} value={option}>
        {option} bedrooms
      </option>
    ));
  }, [bedroomsOptions]);

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
              {propertyTypeOptions}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Number of bedrooms</FormLabel>
            <Select onChange={(e) => setBedrooms(e.target.value === "any" ? null : Number(e.target.value))}>
              <option key="any" value="any" >Any number of bedrooms</option>
              {bedroomOptions}
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
            <TableContainer maxW="100%" overflowX="auto">
              {listingsFound !== null && <Text fontSize={"20px"} fontWeight={"bold"} className="flex justify-center">{listingsFound} listings found that match your preferences</Text>}
              <Table variant="simple" size="sm" className="mt-10">
                <Thead>
                  <Tr>
                    <Th fontSize={"20px"} fontWeight={"bold"} width="30%">Property name</Th>
                    <Th fontSize={"20px"} fontWeight={"bold"} width="50%">Summary</Th>
                    <Th fontSize={"20px"} fontWeight={"bold"} width="10%">Daily Rate</Th>
                    <Th fontSize={"20px"} fontWeight={"bold"} width="10%">Rating</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {tableRows}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        )}
    </Layout>
  );
}