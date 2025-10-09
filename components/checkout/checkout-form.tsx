import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomerDetailsFormProps {
  customerDetails: {
    name: string;
    email: string;
    contact1: string;
    contact2: string;
    address: string;
    district: string;
    state: string;
    instagramId:string;
    pincode: string;
    landmark: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export const CustomerDetailsForm = ({
  customerDetails,
  handleInputChange,
}: CustomerDetailsFormProps) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Name"
          value={customerDetails.name}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="Email address"
          value={customerDetails.email}
          onChange={handleInputChange}
          required
        />
      </div>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="contact1">Contact Number 1</Label>
        <Input
          id="contact1"
          name="contact1"
          placeholder="Primary phone number"
          value={customerDetails.contact1}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact2">Contact Number 2</Label>
        <Input
          id="contact2"
          name="contact2"
          placeholder="Secondary phone number"
          value={customerDetails.contact2}
          onChange={handleInputChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact2">Instagram ID</Label>
        <Input
          id="instagramId"
          name="instagramId"
          placeholder="Instagram ID"
          value={customerDetails.instagramId}
          onChange={handleInputChange}
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="address">Address</Label>
      <Textarea
        id="address"
        name="address"
        placeholder="Enter your address"
        value={customerDetails.address}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="landmark">Landmark (Optional)</Label>
      <Input
        id="landmark"
        name="landmark"
        placeholder="Nearby landmark"
        value={customerDetails.landmark}
        onChange={handleInputChange}
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="district">District</Label>
      <Input
        id="district"
        name="district"
        placeholder="District"
        value={customerDetails.district}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="state">State</Label>
      <Input
        id="state"
        name="state"
        placeholder="State"
        value={customerDetails.state}
        onChange={handleInputChange}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="pincode">Pincode</Label>
      <Input
        id="pincode"
        name="pincode"
        placeholder="Pincode"
        value={customerDetails.pincode}
        onChange={handleInputChange}
        required
      />
    </div>
  </div>
);