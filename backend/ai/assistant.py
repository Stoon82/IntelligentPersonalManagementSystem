from typing import Optional, List, Dict, Any
from .model_manager import ModelManager
from .data_processor import DataProcessor

class IPMSAssistant:
    def __init__(self, model_manager: ModelManager, data_processor: DataProcessor):
        self.model_manager = model_manager
        self.data_processor = data_processor

    def initialize(self, model_path: Optional[str] = None) -> bool:
        """Initialize or switch the AI assistant"""
        return self.model_manager.initialize_model(model_path)

    def generate_response(self, prompt: str, context_types: Optional[List[str]] = None,
                         max_length: Optional[int] = None) -> str:
        """Generate AI response with optional context"""
        # Add context processing logic here
        return self.model_manager.generate_response(prompt, max_length)

    def analyze_journal_sentiment(self, entry: str) -> Dict[str, Any]:
        """Analyze sentiment of journal entry"""
        return self.model_manager.analyze_sentiment(entry)

    def process_user_data(self, data_types: List[str], user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process user data for AI training"""
        return self.data_processor.process_user_data(data_types, user_data)

    def get_goal_suggestions(self, user_data: Dict[str, Any]) -> List[str]:
        """Get AI-generated goal suggestions"""
        return self.data_processor.get_goal_suggestions(user_data)

    def categorize_activity(self, activity_data: Dict[str, Any]) -> str:
        """Categorize activity using AI"""
        return self.data_processor.categorize_activity(activity_data)
