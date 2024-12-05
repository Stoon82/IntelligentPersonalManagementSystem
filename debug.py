Array.from(elements).some(element => {
  // ... logic ...
  return false;
});import logging
import sys
import os
from datetime import datetime
from functools import wraps
import traceback

class DebugLogger:
    def __init__(self, name='IPMS', log_file=None):
        self.logger = logging.getLogger(name)
        self.logger.setLevel(logging.DEBUG)
        
        # Create logs directory if it doesn't exist
        if not os.path.exists('logs'):
            os.makedirs('logs')
            
        # Default log file name with timestamp if none provided
        if log_file is None:
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            log_file = f'logs/debug_{timestamp}.log'
            
        # File handler for logging to file
        file_handler = logging.FileHandler(log_file)
        file_handler.setLevel(logging.DEBUG)
        file_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        file_handler.setFormatter(file_formatter)
        
        # Console handler for logging to stdout
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(logging.INFO)
        console_formatter = logging.Formatter(
            '%(levelname)s: %(message)s'
        )
        console_handler.setFormatter(console_formatter)
        
        # Add handlers to logger
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console_handler)
    
    def debug(self, message):
        self.logger.debug(message)
        
    def info(self, message):
        self.logger.info(message)
        
    def warning(self, message):
        self.logger.warning(message)
        
    def error(self, message):
        self.logger.error(message)
        
    def critical(self, message):
        self.logger.critical(message)

def function_logger(func):
    """Decorator to log function entry, exit, and execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        logger = logging.getLogger('IPMS')
        
        # Log function entry
        logger.debug(f"Entering function: {func.__name__}")
        logger.debug(f"Arguments: args={args}, kwargs={kwargs}")
        
        start_time = datetime.now()
        try:
            # Execute function
            result = func(*args, **kwargs)
            
            # Log successful execution
            execution_time = (datetime.now() - start_time).total_seconds()
            logger.debug(f"Function {func.__name__} completed successfully in {execution_time:.2f} seconds")
            return result
            
        except Exception as e:
            # Log error if function fails
            logger.error(f"Error in function {func.__name__}: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            raise
            
    return wrapper

# Create a global logger instance
debug_logger = DebugLogger()

# Example usage:
if __name__ == "__main__":
    # Basic logging
    debug_logger.debug("This is a debug message")
    debug_logger.info("This is an info message")
    debug_logger.warning("This is a warning message")
    debug_logger.error("This is an error message")
    
    # Example of using the function logger decorator
    @function_logger
    def example_function(x, y):
        return x + y
    
    result = example_function(5, 3)
    print(f"Result: {result}")
