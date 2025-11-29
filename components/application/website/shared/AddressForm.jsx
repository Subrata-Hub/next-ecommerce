"use client";
import { addressSchema } from "@/zodSchema/addressSchema";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createPortal } from "react-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Select from "@/components/application/Select";
import { addressTtpes, orign } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import ButtonLoading from "../../ButtonLoading";

import { v4 as uuidv4 } from "uuid";
import useFetch from "@/hooks/useFetch";
import { getDistance } from "geolib";
import { showToast } from "@/lib/showToast";
import axios from "axios";

import { setShowAddressForm } from "@/store/slices/settingSlice";
import { setPostLoginRedirect } from "@/store/slices/authSlice";
import { WEBSITE_CHECKOUT } from "@/routes/WebsiteRoutes";
import { useRouter } from "next/navigation";
import { getLocalCartId } from "@/lib/helperFunction";

// const sessionKey = uuidv4();

const access_token = process.env.NEXT_PUBLIC_ACCESS_TOKEN;

const AddressForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = useSelector((state) => state.authStore.auth);
  const [sessionToken] = useState(() => uuidv4());
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const postAddressRedirect = useSelector(
    (state) => state.authStore.postLoginRedirect
  );
  // const [location, setLocation] = useState({ lat: 0, lng: 0 });
  // const [distanceFromOrign, setDistanceFromOrign] = useState(0);

  const { data: getSuggestion } = useFetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
      query
    )}&access_token=${access_token}&session_token=${sessionToken}`
  );

  const { data: address, loading: addressLoading } = useFetch(
    "/api/address/getAddress",
    "GET",
    {},
    !!auth // ⭐ only run when auth exists
  );

  const formSchema = addressSchema.pick({
    label: true,
    addressType: true,
    firstName: true,
    lastName: true,
    phoneNumber: true,
    autocomplete_location: true,
    address_line_1: true,
    address_line_2: true,
    city: true,
    state: true,
    pincode: true,
    location: true,
    distance: true,
    isDefaultAddress: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      addressType: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      autocomplete_location: "",
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      pincode: "",
      location: { lat: 0, lng: 0 },
      distance: 0,
      isDefaultAddress: false,
    },
  });

  // 1. Fetch Suggestions Effect
  useEffect(() => {
    if (!query || query.trim().length <= 1) {
      setSuggestions([]); // Clear list
      return; // ❌ EXIT FUNCTION IMMEDIATELY
    }

    const controller = new AbortController();
    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
            query
          )}&access_token=${access_token}&session_token=${sessionToken}`,
          { signal: controller.signal }
        );

        if (!response.ok) return; // Prevent 400 errors from crashing logic

        const data = await response.json();
        setSuggestions(data.suggestions || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Mapbox fetch error:", error);
        }
      }
    }, 200); // 500ms Debounce inside the effect

    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [query, sessionToken]);
  console.log(getSuggestion);

  // 2. Handle Click (FIXED CONTEXT ERROR HERE)
  const handleSuggestionClick = async (suggestion, address) => {
    // Update form value
    form.setValue("autocomplete_location", suggestion.name);

    // Clear query to hide dropdown and prevent re-fetching
    // Because we decoupled query from form value, this won't trigger a "search for empty string"
    setQuery("");
    setSuggestions([]);

    try {
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.mapbox_id}?session_token=${sessionToken}&access_token=${access_token}`
      );

      const data = await response.json();
      const feature = data.features[0];

      // Populate Address Lines
      // form.setValue("address_line_1", feature.properties.name || "");
      form.setValue("address_line_2", feature.properties.place_formatted || "");

      // ✅ FIXED: Parse Context Object (Not Array)
      const context = feature.properties.context || {};

      if (context.postcode && context.postcode.name) {
        form.setValue("pincode", String(context.postcode.name));
      }
      if (context.place && context.place.name) {
        form.setValue("city", context.place.name);
      }
      if (context.region && context.region.name) {
        form.setValue("state", context.region.name);
      }

      if (feature.geometry && feature.geometry.coordinates) {
        // Mapbox gives [Lng, Lat]
        const destLng = feature.geometry.coordinates[0];
        const destLat = feature.geometry.coordinates[1];

        // 1. Update Form Location
        form.setValue("location", { lng: destLng, lat: destLat });

        // 2. Calculate Distance SAFELY
        // Check if 'orign' is valid array with 2 numbers
        if (orign && Array.isArray(orign) && orign.length === 2) {
          const originLng = orign[0];
          const originLat = orign[1];

          // Double check neither is undefined/null
          if (
            typeof originLat === "number" &&
            typeof originLng === "number" &&
            typeof destLat === "number" &&
            typeof destLng === "number"
          ) {
            const dist = getDistance(
              { latitude: originLat, longitude: originLng },
              { latitude: destLat, longitude: destLng }
            );

            console.log("Calculated Distance (meters):", dist);
            form.setValue("distance", dist);
          }
        } else {
          console.warn(
            "Cannot calculate distance: 'orign' is missing or invalid in utils.js"
          );
        }
      }
    } catch (error) {
      console.error("Error fetching address details:", error);
    }
  };
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/address/create",
        values
      );

      if (!response.success) {
        throw new Error(response.message);
      }

      console.log(response);

      if (!response.success && address.data && address.data.length > 0) {
        return;
      } else {
        const newAddressId = response.data?._id || response.data?.id; // Ensure your API returns the created object
        const currentCartId = getLocalCartId();

        if (newAddressId && currentCartId) {
          try {
            await axios.post(`/api/cart/update`, {
              cartId: currentCartId,
              addressId: newAddressId,
            });

            // dispatch(setPostLoginRedirect(WEBSITE_CHECKOUT));
          } catch (cartError) {
            console.error("Background cart update failed:", cartError);
            // Optional: You might want to throw here if cart update is mandatory
          }
        }
      }

      dispatch(setShowAddressForm(false));
      form.reset();
      showToast("success", response.message);

      // router.push(WEBSITE_CHECKOUT);
      if (postAddressRedirect) {
        router.push(postAddressRedirect);
        dispatch(setPostLoginRedirect(null));
      }
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid md:grid-cols-2 grid-cols-1 gap-5 mt-5">
          <div className="mb-1">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Label</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-1">
            <FormField
              control={form.control}
              name="addressType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address Label</FormLabel>
                  <FormControl>
                    <Select
                      options={addressTtpes}
                      selected={field.value}
                      setSelected={field.onChange}
                      isMulti={false}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-5">
          <div className="mb-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>FirstName</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter First Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LastName</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Last Name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-1">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PhoneNumber</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 mt-5">
          <div className="mb-5 relative z-[50000000000000]">
            <FormField
              control={form.control}
              name="autocomplete_location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search address to autocomplete</FormLabel>
                  <FormControl>
                    <Input
                      type="search"
                      placeholder="Search Your Address"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e); // 1. Update React Hook Form (for saving)
                        setQuery(e.target.value); // 2. Update Local State (for API search)
                      }}
                      autoComplete="off"
                    />
                    {/* <div className="relative">
                      <svg
                        className="absolute"
                        viewBox="0 0 18 18"
                        xmlSpace="preserve"
                        width="20"
                        height="20"
                        fill="currentColor"
                        style={{ top: 8, right: 8 }}
                      >
                        <path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"></path>
                      </svg>
                     
                    </div> */}
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* --- SUGGESTION DROPDOWN START --- */}
            {suggestions.length > 0 && query.length > 2 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1 z-[60]">
                {suggestions.map((item, index) => (
                  <div
                    // Use mapbox_id if available, otherwise fallback to index
                    key={item.mapbox_id || index}
                    onClick={() => handleSuggestionClick(item)}
                    className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                  >
                    {/* <p className="font-medium text-sm text-gray-800">
                      {item.name}
                    </p> */}
                    <p className="text-xs text-gray-500 truncate">
                      {item.place_formatted || item.full_address}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {/* --- SUGGESTION DROPDOWN END --- */}
          </div>
        </div>
        <div className="mb-5">
          <FormField
            control={form.control}
            name="address_line_1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apartment, suite, etc.</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="mb-5">
          <FormField
            control={form.control}
            name="address_line_2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid md:grid-cols-3 grid-cols-1 gap-5 mt-5">
          <div className="mb-1">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-1">
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mb-1">
            <FormField
              control={form.control}
              name="pincode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pincode</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <ButtonLoading
            type="submit"
            text="Add Address"
            className="cursor-pointer"
            loading={loading}
          />
        </div>
      </form>
    </Form>
  );
};

export default AddressForm;
