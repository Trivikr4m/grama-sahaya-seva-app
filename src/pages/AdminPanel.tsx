
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, Eye, Edit, Calendar, MapPin, Phone, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Complaint {
  id: string;
  complaint_id: string;
  name: string;
  mobile: string;
  category: string;
  description: string;
  location_address: string;
  location_lat: number;
  location_lng: number;
  status: string;
  created_at: string;
  photo_url?: string;
  remarks?: string;
}

const AdminPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newRemarks, setNewRemarks] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    checkAdminStatus();
    loadComplaints();
  }, [user, navigate]);

  const checkAdminStatus = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking admin status:', error);
        toast({
          title: "Access denied",
          description: "Unable to verify admin status",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      if (data?.role !== 'admin') {
        toast({
          title: "Access denied",
          description: "You don't have admin privileges",
          variant: "destructive"
        });
        navigate('/');
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error('Error checking admin status:', error);
      navigate('/');
    }
  };

  const loadComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setComplaints(data || []);
    } catch (error: any) {
      console.error('Error loading complaints:', error);
      toast({
        title: "Error",
        description: "Failed to load complaints",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateComplaintStatus = async () => {
    if (!selectedComplaint || !newStatus) return;

    try {
      const { error } = await supabase
        .from('complaints')
        .update({
          status: newStatus,
          remarks: newRemarks,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedComplaint.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Complaint status updated successfully",
      });

      setSelectedComplaint(null);
      setNewStatus('');
      setNewRemarks('');
      loadComplaints(); // Reload complaints
    } catch (error: any) {
      console.error('Error updating complaint:', error);
      toast({
        title: "Error",
        description: "Failed to update complaint status",
        variant: "destructive"
      });
    }
  };

  const openUpdateDialog = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setNewRemarks(complaint.remarks || '');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredComplaints = complaints.filter(complaint => 
    filterStatus === 'All' || complaint.status === filterStatus
  );

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center text-gray-600 hover:text-green-600 transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading complaints...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                  <div className="text-gray-600 text-sm">Total</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                  <div className="text-gray-600 text-sm">Pending</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div>
                  <div className="text-gray-600 text-sm">In Progress</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                  <div className="text-gray-600 text-sm">Resolved</div>
                </CardContent>
              </Card>
            </div>

            {/* Filter */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Complaints</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredComplaints.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-gray-500">No complaints found.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredComplaints.map((complaint) => (
                  <Card key={complaint.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">
                              #{complaint.complaint_id}
                            </h3>
                            <Badge className={`px-2 py-1 ${getStatusColor(complaint.status)}`}>
                              {complaint.status}
                            </Badge>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{complaint.name}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">{complaint.mobile}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">
                                  {new Date(complaint.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {complaint.location_address && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4 text-gray-400" />
                                  <span className="text-gray-600 truncate">{complaint.location_address}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <p className="text-gray-800 font-medium">{complaint.category}</p>
                            <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                              {complaint.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Complaint Details #{complaint.complaint_id}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-medium">{complaint.name}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Mobile</p>
                                    <p className="font-medium">{complaint.mobile}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Category</p>
                                    <p className="font-medium">{complaint.category}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <Badge className={`${getStatusColor(complaint.status)}`}>
                                      {complaint.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm text-gray-500">Description</p>
                                  <p className="mt-1">{complaint.description}</p>
                                </div>
                                {complaint.location_address && (
                                  <div>
                                    <p className="text-sm text-gray-500">Location</p>
                                    <p className="mt-1">{complaint.location_address}</p>
                                  </div>
                                )}
                                {complaint.remarks && (
                                  <div>
                                    <p className="text-sm text-gray-500">Remarks</p>
                                    <p className="mt-1 bg-blue-50 p-3 rounded-md">{complaint.remarks}</p>
                                  </div>
                                )}
                                {complaint.photo_url && (
                                  <div>
                                    <p className="text-sm text-gray-500">Photo</p>
                                    <img 
                                      src={complaint.photo_url} 
                                      alt="Complaint" 
                                      className="mt-2 max-w-full h-auto rounded-md"
                                    />
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateDialog(complaint)}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Update
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Update Status Dialog */}
      {selectedComplaint && (
        <Dialog open={true} onOpenChange={() => setSelectedComplaint(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Complaint #{selectedComplaint.complaint_id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remarks (Optional)
                </label>
                <Textarea
                  value={newRemarks}
                  onChange={(e) => setNewRemarks(e.target.value)}
                  placeholder="Add any remarks or updates..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedComplaint(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={updateComplaintStatus}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Update Status
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPanel;
