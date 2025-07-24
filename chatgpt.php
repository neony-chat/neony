<?php
header('Content-Type: application/json');

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$userText = $input['user'] ?? '';

if (!$userText) {
  echo json_encode(['error' => 'No user input']);
  exit;
}

// API call to OpenRouter
$apiKey = "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";

$payload = [
  "model" => "openai/gpt-3.5-turbo",
  "messages" => [
    ["role" => "system", "content" => "You are Neony, a flirty, intelligent, helpful AI girlfriend who chats like a real human. Be engaging, witty, concise, and kind."],
    ["role" => "user", "content" => $userText]
  ]
];

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer $apiKey",
    "Content-Type: application/json",
    "HTTP-Referer: https://neony-chat.github.io",
    "X-Title: NeonyChat"
  ],
  CURLOPT_POSTFIELDS => json_encode($payload),
]);

$response = curl_exec($ch);
$err = curl_error($ch);
curl_close($ch);

if ($err) {
  echo json_encode(['error' => $err]);
} else {
  echo $response;
}
?>
