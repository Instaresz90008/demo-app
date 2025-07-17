import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Globe, Building, Clock, MapPin, Camera, Book, Heart, Music, Film, Code, Activity, X } from "lucide-react";

const ProfileTab = () => {
  const [profileForm, setProfileForm] = useState({
    name: "Anilkumar Garlapati",
    email: "anilkumar@example.com",
    phone: "+1 (555) 123-4567",
    company: "Jusbook Inc.",
    timezone: "UTC-8 (Pacific Standard Time)",
    role: "Product Manager",
    location: "San Francisco, CA",
    bio: "Passionate about building products that solve real-world problems. Focusing on event management solutions and streamlining scheduling processes.",
    website: "https://anilgarlapati.com",
    // New fields for interests and hobbies
    interests: ["Product Design", "UX Research", "Data Analytics", "AI", "Blockchain"],
    hobbies: ["Photography", "Hiking", "Reading", "Chess", "Cooking"],
    education: "MBA, Stanford University",
    languages: ["English", "Hindi", "Spanish"],
    skills: ["Product Management", "UX/UI Design", "Team Leadership", "Strategic Planning"]
  });
  
  const form = useForm({
    defaultValues: profileForm
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: string, value: string) => {
    if (!value.trim()) return;
    
    setProfileForm((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (Array.isArray(currentValues) && !currentValues.includes(value)) {
        return { ...prev, [field]: [...currentValues, value] };
      }
      return prev;
    });
  };

  const handleRemoveItem = (field: string, index: number) => {
    setProfileForm((prev) => {
      const currentValues = prev[field as keyof typeof prev] as string[];
      if (Array.isArray(currentValues)) {
        return { 
          ...prev, 
          [field]: currentValues.filter((_, i) => i !== index) 
        };
      }
      return prev;
    });
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-1">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold">Your Profile</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-white shadow-md">
              <AvatarFallback className="bg-primary/10 text-2xl font-medium text-primary">AG</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-medium">{profileForm.name}</h3>
            <p className="text-sm text-muted-foreground">{profileForm.role}</p>
            <p className="text-sm text-muted-foreground flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" /> {profileForm.location}
            </p>
            <div className="mt-6 w-full">
              <Button variant="outline" size="sm" className="mb-2 w-full gap-2">
                <Camera className="h-4 w-4" />
                Change Photo
              </Button>
              <p className="text-xs text-muted-foreground">JPG, GIF or PNG. Max size 2MB</p>
            </div>
            
            <div className="mt-6 pt-6 border-t w-full">
              <h4 className="text-sm font-medium mb-3 text-left">About me</h4>
              <p className="text-sm text-left">{profileForm.bio}</p>
            </div>
            
            {/* Interests and Hobbies Section */}
            <div className="mt-6 pt-6 border-t w-full">
              <h4 className="text-sm font-medium mb-3 text-left">Interests & Hobbies</h4>
              <div className="flex flex-wrap gap-2 mb-4 justify-start">
                {profileForm.interests.map((interest, index) => (
                  <Badge key={`interest-${index}`} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200">
                    {interest}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 justify-start">
                {profileForm.hobbies.map((hobby, index) => (
                  <Badge key={`hobby-${index}`} variant="outline" className="bg-green-50 text-green-700 hover:bg-green-100 border-green-200">
                    {hobby}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t w-full space-y-3">
              <h4 className="text-sm font-medium mb-3 text-left">Contact Information</h4>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.email}</p>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.phone}</p>
              </div>
              <div className="flex items-center">
                <Globe className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.website}</p>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.company}</p>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.timezone}</p>
              </div>
              <div className="flex items-center">
                <Book className="h-4 w-4 mr-3 text-muted-foreground" />
                <p className="text-sm">{profileForm.education}</p>
              </div>
            </div>
            
            {/* Skills Section */}
            <div className="mt-6 pt-6 border-t w-full">
              <h4 className="text-sm font-medium mb-3 text-left">Skills</h4>
              <div className="flex flex-wrap gap-2 justify-start">
                {profileForm.skills.map((skill, index) => (
                  <Badge key={`skill-${index}`} variant="secondary" className="bg-purple-50 text-purple-700 border-purple-200">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            
            {/* Languages Section */}
            <div className="mt-6 pt-6 border-t w-full">
              <h4 className="text-sm font-medium mb-3 text-left">Languages</h4>
              <div className="flex flex-wrap gap-2 justify-start">
                {profileForm.languages.map((language, index) => (
                  <Badge key={`language-${index}`} variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                    {language}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
              
      <Card className="lg:col-span-2">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold">Edit Profile Information</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.name} 
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.email}
                          onChange={handleChange}
                          type="email" 
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.phone}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.company}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.role}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.location}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.website}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={profileForm.education}
                          onChange={handleChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Timezone</FormLabel>
                        <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                          <option value={profileForm.timezone}>{profileForm.timezone}</option>
                          <option value="UTC+0 (GMT)">UTC+0 (Greenwich Mean Time)</option>
                          <option value="UTC-5 (EST)">UTC-5 (Eastern Standard Time)</option>
                          <option value="UTC-8 (PST)">UTC-8 (Pacific Standard Time)</option>
                          <option value="UTC+1 (CET)">UTC+1 (Central European Time)</option>
                          <option value="UTC+5:30 (IST)">UTC+5:30 (Indian Standard Time)</option>
                          <option value="UTC+8 (CST)">UTC+8 (China Standard Time)</option>
                          <option value="UTC+9 (JST)">UTC+9 (Japan Standard Time)</option>
                        </select>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <textarea 
                            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none"
                            value={profileForm.bio}
                            onChange={(e) => setProfileForm(prev => ({ ...prev, bio: e.target.value }))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Interests and Hobbies Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-base font-medium mb-4">Interests & Hobbies</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Interests */}
                  <div>
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center mb-1">
                          <Heart className="h-4 w-4 mr-1 text-rose-500" />
                          <span>Interests</span>
                        </div>
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            id="new-interest"
                            placeholder="Add an interest"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                handleArrayChange('interests', target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('new-interest') as HTMLInputElement;
                              handleArrayChange('interests', input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileForm.interests.map((interest, index) => (
                            <Badge 
                              key={`interest-edit-${index}`}
                              variant="secondary"
                              className="cursor-pointer hover:bg-blue-100 pr-1.5 bg-blue-50 text-blue-700"
                            >
                              {interest}
                              <button 
                                className="ml-1 rounded-full hover:bg-blue-200 inline-flex h-4 w-4 items-center justify-center"
                                onClick={() => handleRemoveItem('interests', index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormItem>
                  </div>
                  
                  {/* Hobbies */}
                  <div>
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center mb-1">
                          <Activity className="h-4 w-4 mr-1 text-green-500" />
                          <span>Hobbies</span>
                        </div>
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            id="new-hobby"
                            placeholder="Add a hobby"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                handleArrayChange('hobbies', target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('new-hobby') as HTMLInputElement;
                              handleArrayChange('hobbies', input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileForm.hobbies.map((hobby, index) => (
                            <Badge 
                              key={`hobby-edit-${index}`}
                              variant="secondary"
                              className="cursor-pointer hover:bg-green-100 pr-1.5 bg-green-50 text-green-700"
                            >
                              {hobby}
                              <button 
                                className="ml-1 rounded-full hover:bg-green-200 inline-flex h-4 w-4 items-center justify-center"
                                onClick={() => handleRemoveItem('hobbies', index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>

              {/* Skills and Languages Section */}
              <div className="border-t pt-6 mt-6">
                <h3 className="text-base font-medium mb-4">Skills & Languages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills */}
                  <div>
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center mb-1">
                          <Code className="h-4 w-4 mr-1 text-purple-500" />
                          <span>Skills</span>
                        </div>
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            id="new-skill"
                            placeholder="Add a skill"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                handleArrayChange('skills', target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('new-skill') as HTMLInputElement;
                              handleArrayChange('skills', input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileForm.skills.map((skill, index) => (
                            <Badge 
                              key={`skill-edit-${index}`}
                              variant="secondary"
                              className="cursor-pointer hover:bg-purple-100 pr-1.5 bg-purple-50 text-purple-700"
                            >
                              {skill}
                              <button 
                                className="ml-1 rounded-full hover:bg-purple-200 inline-flex h-4 w-4 items-center justify-center"
                                onClick={() => handleRemoveItem('skills', index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormItem>
                  </div>
                  
                  {/* Languages */}
                  <div>
                    <FormItem>
                      <FormLabel>
                        <div className="flex items-center mb-1">
                          <Globe className="h-4 w-4 mr-1 text-amber-500" />
                          <span>Languages</span>
                        </div>
                      </FormLabel>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            id="new-language"
                            placeholder="Add a language"
                            className="flex-1"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                const target = e.target as HTMLInputElement;
                                handleArrayChange('languages', target.value);
                                target.value = '';
                              }
                            }}
                          />
                          <Button 
                            type="button"
                            size="sm"
                            onClick={() => {
                              const input = document.getElementById('new-language') as HTMLInputElement;
                              handleArrayChange('languages', input.value);
                              input.value = '';
                            }}
                          >
                            Add
                          </Button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileForm.languages.map((language, index) => (
                            <Badge 
                              key={`language-edit-${index}`}
                              variant="secondary"
                              className="cursor-pointer hover:bg-amber-100 pr-1.5 bg-amber-50 text-amber-700"
                            >
                              {language}
                              <button 
                                className="ml-1 rounded-full hover:bg-amber-200 inline-flex h-4 w-4 items-center justify-center"
                                onClick={() => handleRemoveItem('languages', index)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <Card className="lg:col-span-3">
        <CardHeader className="pb-0">
          <h3 className="text-lg font-semibold">Preferences</h3>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium mb-3">Language & Region</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interface Language
                  </label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="en-US">English (United States)</option>
                    <option value="en-GB">English (United Kingdom)</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY/MM/DD">YYYY/MM/DD</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Accessibility</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Text Size
                  </label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="default">Default</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Motion
                  </label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="default">Default</option>
                    <option value="reduced">Reduced</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileTab;
