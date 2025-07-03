
export const initializeSampleData = () => {
  const existingComplaints = localStorage.getItem('complaints');
  
  if (!existingComplaints) {
    const sampleComplaints = [
      {
        id: 'VV001234',
        name: 'Rajesh Kumar',
        mobile: '9876543210',
        category: 'Broken Roads',
        description: 'There is a big pothole on the main road near the village temple. It becomes very dangerous during monsoon and many vehicles get damaged.',
        location: 'Main Road, near Village Temple',
        status: 'In Progress',
        dateSubmitted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        remarks: 'Work has been assigned to the local contractor. Expected completion in 1 week.'
      },
      {
        id: 'VV001235',
        name: 'Priya Devi',
        mobile: '9876543211',
        category: 'Street Lights',
        description: 'Street lights near the school are not working for the past 2 weeks. Children face difficulty walking in the evening.',
        location: 'School Road',
        status: 'Resolved',
        dateSubmitted: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        remarks: 'Street lights have been repaired and are now working properly.'
      },
      {
        id: 'VV001236',
        name: 'Suresh Reddy',
        mobile: '9876543212',
        category: 'Garbage Collection',
        description: 'Garbage is not being collected regularly from our area. The waste is piling up and creating health hazards.',
        location: 'Gandhi Nagar Colony',
        status: 'Pending',
        dateSubmitted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'VV001237',
        name: 'Lakshmi Amma',
        mobile: '9876543213',
        category: 'Drainage Issues',
        description: 'Water logging problem during rains due to blocked drainage. Water enters houses and damages property.',
        location: 'Nehru Street',
        status: 'In Progress',
        dateSubmitted: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        remarks: 'Drainage cleaning work is scheduled for this week.'
      },
      {
        id: 'VV001238',
        name: 'Mohan Rao',
        mobile: '9876543214',
        category: 'Water Supply',
        description: 'No water supply for the past 3 days in our area. Residents are facing severe water shortage.',
        location: 'Krishna Colony',
        status: 'Resolved',
        dateSubmitted: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        remarks: 'Water supply has been restored. The issue was due to a pump failure which has been fixed.'
      }
    ];

    localStorage.setItem('complaints', JSON.stringify(sampleComplaints));
  }
};
