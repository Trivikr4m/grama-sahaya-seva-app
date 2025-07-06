
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import LocationPicker from '@/components/LocationPicker';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    category: '',
    description: '',
    location: { lat: 0, lng: 0, address: '' },
    photo: null as File | null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationSelected, setLocationSelected] = useState(false);

  const categories = [
    'Broken Roads',
    'Street Lights',
    'Garbage Collection',
    'Drainage Issues',
    'Water Supply',
    'Public Toilets',
    'Other'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLocationSelect = (location: { lat: number; lng: number; address: string }) => {
    setFormData(prev => ({ ...prev, location }));
    setLocationSelected(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, photo: file }));
  };

  const generateComplaintId = () => {
    return `VV${Date.now().toString().slice(-6)}`;
  };

  const uploadPhoto = async (file: File, complaintId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${complaintId}-${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from('complaint-photos')
      .upload(fileName, file);

    if (error) {
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('complaint-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a complaint",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }

    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.mobile || !formData.category || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Validate location selection
    if (!locationSelected || !formData.location.address) {
      toast({
        title: "Error",
        description: "Please select a location on the map",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const complaintId = generateComplaintId();
      let photoUrl = null;

      // Upload photo if provided
      if (formData.photo) {
        photoUrl = await uploadPhoto(formData.photo, complaintId);
      }

      // Create complaint in database
      const { error } = await supabase
        .from('complaints')
        .insert({
          complaint_id: complaintId,
          user_id: user.id,
          name: formData.name,
          mobile: formData.mobile,
          category: formData.category,
          description: formData.description,
          location_lat: formData.location.lat,
          location_lng: formData.location.lng,
          location_address: formData.location.address,
          photo_url: photoUrl,
          status: 'Pending'
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: `Your complaint has been submitted. ID: ${complaintId}`,
      });

      // Navigate to tracking page with the complaint ID
      setTimeout(() => {
        navigate(`/track?id=${complaintId}`);
      }, 2000);

    } catch (error: any) {
      console.error('Error submitting complaint:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit complaint. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-800">Submit Your Complaint</CardTitle>
              <p className="text-gray-600">Help us improve our village by reporting civic issues</p>
              {!user && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    You need to <Link to="/auth" className="text-yellow-900 underline font-medium">sign in</Link> to submit complaints.
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Issue Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issue category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the issue in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                  {formData.location.address && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Selected Address:</strong> {formData.location.address}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="photo">Photo (Optional)</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-400 transition-colors">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <span className="text-green-600 hover:text-green-700">Click to upload</span>
                      <span className="text-gray-500"> or drag and drop</span>
                    </label>
                    {formData.photo && (
                      <p className="text-sm text-gray-600 mt-2">
                        Selected: {formData.photo.name}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-3"
                  disabled={isSubmitting || !user}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubmitComplaint;
