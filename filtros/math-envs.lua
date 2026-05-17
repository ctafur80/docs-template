

-- Filter for math-notes documents. It allows the use of web enviromnents (like in LaTeX)
-- and the use of automatic titles in references (kind of as with `nameref` LaTeX package).



-- Math environments data
local envs_data = {
    proof = {
        title = "demostración",
        sep = ".---",
        last_symbol = " ▢",
    },
    definition = {
        title = "definición",
        sep = ".---",
        last_symbol = nil,
    },
    axiom = {
        title = "axioma",
        sep = ".---",
        last_symbol = nil,
    },
    theorem = {
        title = "teorema",
        sep = ".---",
        last_symbol = nil,
    },
    lemma = {
        title = "lema",
        sep = ".---",
        last_symbol = nil,
    },
    corollary = {
        title = "corolario",
        sep = ".---",
        last_symbol = nil,
    },
    exercise = {
        title = "ejercicio",
        sep = ".---",
        last_symbol = " △",
    },
    example = {
        title = "ejemplo",
        sep = ".---",
        last_symbol = " △",
    },
}


-- binds env IDs with the text to insert in the link.
local references = {}



-- Capitalises a string
function cap_string(str)
    new_str = string.upper(string.sub(str, 1, 1)) .. string.sub(str, 2)
    return new_str
end


--[[
function format_string(str, language)
    -- Checkings
    -- TODO `language` tiene que ser un lenguaje válido para Pandoc.

    local str_formatted = pandoc.read(str, language).blocks[1]
    if str_formatted and str_formatted.content then
        for _, inline in ipairs(str_formatted.content) do
            table.insert(str_formatted, inline)
        end
    end

    return str_formatted
end
--]]


-- Helping function for checking if an element has a class
function has_class(element, class_name)
    -- TODO Maybe the first condition in test is not neccesary.
    if not element.attr or not element.attr.classes then return false end
    for _, c in ipairs(element.attr.classes) do
        if c == class_name then return true end
    end
    return false
end





-- Scan 1. Write environment title and collect cross references
-- ----------------------------------------------------------------------------------------
local DivProcessor = {
    Div = function(div)

        local num_of_math_envs = 0

        for env_key, env_data in pairs(envs_data) do
            if has_class(div, env_key) then

                -- Checkings
                num_of_math_envs = num_of_math_envs + 1
                assert(num_of_math_envs <= 1, "Error. There is a div element with more than one math environment classes.")

                -- Simpler names for this function scope.
                local title_text = cap_string(env_data.title)
                local title_sep = env_data.sep
                local label = div.attr.attributes["data-label"]
                local ref_text = cap_string(env_data.title)


                -- Builds titles to insert in envs and in references.
                local id = div.attr.identifier
                local title_inlines = { pandoc.Str(title_text) }
                if label and label ~= "" then

                    -- 1. For environments.
                    table.insert(title_inlines, pandoc.Str(" ("))
                    local formatted_label = pandoc.read(label, "markdown").blocks[1]
                    for _, inline in ipairs(formatted_label.content) do
                        table.insert(title_inlines, inline)
                    end
                    table.insert(title_inlines, pandoc.Str(")"))

                    -- TODO Make `read_markdown()` function.

                    -- Title-text separator
                    local sep_block = pandoc.read(title_sep, "markdown").blocks[1]
                    if sep_block and sep_block.content then
                        for _, inline in ipairs(sep_block.content) do
                            table.insert(title_inlines, inline)
                        end
                    end

                    -- 2. For references.
                    if id and id ~= "" then
                        references["#" .. id] = { pandoc.Str(ref_text) }
                        table.insert(references["#" .. id], pandoc.Str(" ("))
                        local formatted_label = pandoc.read(label, "markdown").blocks[1]
                        for _, inline in ipairs(formatted_label.content) do
                            table.insert(references["#" .. id], inline)
                        end
                        table.insert(references["#" .. id], pandoc.Str(")"))
                    end

                    -- TODO No llego a entender por qué es necesario.
                    -- Delete the label for avoiding duplications.
                    div.attr.attributes["data-label"] = nil
                end


                local formatted_title = pandoc.Strong(pandoc.Emph(title_inlines))


                -- Decide where to insert the title based on the div's content.
                if #div.content == 0 or div.content[1].t ~= "Para" then
                    local title_paragraph = pandoc.Para({ formatted_title })
                    table.insert(div.content, 1, title_paragraph)
                else
                    div.content[1].content:insert(1, formatted_title)
                    div.content[1].content:insert(2, pandoc.Space())
                end


                -- Write environment final symbol.
                local end_symbol = env_data.last_symbol
                if end_symbol and end_symbol ~= "" then
                    if #div.content > 0 and div.content[#div.content].t == "Para" then
                        local last_block = div.content[#div.content]
                        local formatted_symbol = pandoc.Span(pandoc.Str(end_symbol), {class = "env-last-symbol"})
                        table.insert(last_block.content, formatted_symbol)
                    end
                end

            end
        end

        return div
    end
}





-- Scan 2. Replace empty links with collected text.
-- ----------------------------------------------------------------------------------------
local LinkResolver = {
    Link = function(link)
        if #link.content == 0 and link.target:match("^#") then
            local ref_content = references[link.target]
            if ref_content then
                link.content = ref_content
            end
        end
        return link
    end
}




-- This filter returns a list of "scans". Pandoc will run them in order.
return {
    DivProcessor,
    LinkResolver
}





