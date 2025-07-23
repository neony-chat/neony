<?php
$apiKey = "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"; // Replace with your OpenAI secret key
$input = json_decode(file_get_contents("php://input"), true);
$prompt = $input['message'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);

$data = [
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "You are Neony, a friendly and witty female AI assistant."],
        ["role" => "user", "content" => $prompt]
    ],
    "temperature" => 0.8
];

curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
$response = curl_exec($ch);
curl_close($ch);

$result = json_decode($response, true);
$reply = $result["choices"][0]["message"]["content"] ?? "Sorry, something went wrong.";

echo json_encode(["reply" => $reply]);
?>
