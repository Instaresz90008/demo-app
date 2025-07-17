
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useVoiceService } from "@/hooks/useVoiceService";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, MessageSquare } from "lucide-react";

const ConversationHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { conversationHistory, fetchConversationHistory } = useVoiceService();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch conversation history when component mounts
  useEffect(() => {
    if (user) {
      fetchConversationHistory();
    }
  }, [user, fetchConversationHistory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-y-1">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)} 
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Your Conversation History</h1>
        </div>
      </div>
      
      {conversationHistory.length === 0 ? (
        <div className="text-center py-10">
          <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No conversation history found</p>
          <Button
            onClick={() => navigate("/voice-assistant")}
            className="mt-4"
          >
            Start a Conversation
          </Button>
        </div>
      ) : (
        <div className="grid gap-6">
          {conversationHistory.map((conversation) => (
            <Card key={conversation.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg">
                  {format(new Date(conversation.created_at), "PPpp")}
                </CardTitle>
                <CardDescription>
                  Conversation #{conversation.id}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">You said:</p>
                  <p>{conversation.user_query}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Tara responded:</p>
                  <p>{conversation.response}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/conversations/${conversation.id}`)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConversationHistory;
