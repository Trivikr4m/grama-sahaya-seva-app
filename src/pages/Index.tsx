
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Search, Settings, Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { initializeSampleData } from '@/utils/sampleData';

const Index = () => {
  const [stats, setStats] = useState({
    totalComplaints: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  });

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData();
    
    // Load actual stats from localStorage
    const complaints = JSON.parse(localStorage.getItem('complaints') || '[]');
    setStats({
      totalComplaints: complaints.length,
      pending: complaints.filter((c: any) => c.status === 'Pending').length,
      inProgress: complaints.filter((c: any) => c.status === 'In Progress').length,
      resolved: complaints.filter((c: any) => c.status === 'Resolved').length
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-800">Village Voice</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link to="/submit" className="text-gray-600 hover:text-green-600 transition-colors">Submit Complaint</Link>
              <Link to="/track" className="text-gray-600 hover:text-green-600 transition-colors">Track Status</Link>
              <Link to="/admin" className="text-gray-600 hover:text-green-600 transition-colors">Admin</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              Your Voice, <span className="text-green-600">Our Action</span>
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Report civic issues in your village and track their resolution. Together, we build a better community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  <FileText className="w-5 h-5 mr-2" />
                  Submit Complaint
                </Button>
              </Link>
              <Link to="/track">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3 text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Track Status
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">Community Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.totalComplaints}</div>
                <div className="text-gray-600">Total Complaints</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.pending}</div>
                <div className="text-gray-600">Pending</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.inProgress}</div>
                <div className="text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stats.resolved}</div>
                <div className="text-gray-600">Resolved</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-gray-800 mb-12">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">1. Submit Your Complaint</h4>
                <p className="text-gray-600">
                  Report issues like broken roads, faulty streetlights, garbage problems, or drainage issues with photos and details.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">2. Track Progress</h4>
                <p className="text-gray-600">
                  Get a unique complaint ID and track the status of your issue from submission to resolution.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-800 mb-4">3. See Results</h4>
                <p className="text-gray-600">
                  Our dedicated team works to resolve your complaints and improve our village's infrastructure.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">Village Voice</span>
          </div>
          <p className="text-gray-400">
            Empowering communities through transparent civic engagement
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
